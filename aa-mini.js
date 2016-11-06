// minimum implementation of aa. aa(gtor)
'use strict';

module.exports = aa;
aa.callback = callback;

var GenProto = function *() {} ().constructor;
var GenFunc = function *() {}.constructor;

function callback(gfn) {
	return function() {
		return gtor2thunk(gfn.apply(this, arguments))();
	};
}

function valuethunk(cb) {
	return function (err, val) {
		if (err) cb(err); else valuecb(val, cb);
	};
}

function valuecb(val, cb) {
	// falsy value: null, undefined, '', 0, -0, NaN, ...
	if (!val) return cb(null, val);

	// generator, generator function
	if (val.constructor !== Function && (
		val.constructor === GenFunc ||
		val.constructor === GenProto &&
		typeof val.next === 'function'))
			val = gtor2thunk(val);

	// pure array
	else if (val.constructor === Array) {
		if (val.some(function (x) {
				return x && (typeof x === 'function' ||
				typeof x.then === 'function' ||
				x.constructor === GenProto &&
				typeof x.next === 'function'); }))
			val = array2thunk(val);
	}

	// pure object
	else if (val.constructor === Object) {
		var keys = Object.keys(val);
		if (keys.some(function (x) {
				return val[x] && (typeof val[x] === 'function' ||
				typeof val[x].then === 'function' ||
				val[x].constructor === GenProto &&
				typeof val[x].next === 'function'); }))
			val = object2thunk(val);
	}

	// function, thunk
	if (typeof val === 'function')
		val(valuethunk(cb));

	// promise, thenable
	else if (typeof val.then === 'function')
		val.then(function (val) { valuecb(val, cb); }, cb);

	// other
	else cb(null, val);
}

function array2thunk(arr) {
	return function (cb) {
		var n = arr.length;
		if (n === 0) return cb(null, arr);
		var res = new Array(n);
		arr.forEach(function (val, i) {
			valuecb(val, x);
			function x(err, val) {
				if (err) n > 0 && cb(err), n = 0;
				else res[i] = val, (--n || valuecb(res, cb)); };
		});
	};
}

function object2thunk(obj) {
	return function (cb) {
		var keys = Object.keys(obj), n = keys.length;
		if (n === 0) return cb(null, obj);
		var res = keys.reduce(function (a, b) { return a[b] = undefined, a; }, {});
		keys.forEach(function (key) {
			valuecb(obj[key], x);
			function x(err, val) {
				if (err) n > 0 && cb(err), n = 0;
				else res[key] = val, (--n || valuecb(res, cb)); };
		});
	};
}

// generators to thunk
function gtor2thunk(gen) {
	if (typeof gen === 'function') gen = gen();
	return function (cb) {
		void function x(err, val) {
			try { var obj = err ? gen.throw(err) : gen.next(val); }
			catch (e) { if (cb) return cb(e); console.error(e); throw e; }
			if (val = obj.value, obj.done) cb && valuecb(val, cb);
			else valuecb(val, x);
		} ();
	};
}

// generators to promise
function aa(gen) {
	if (typeof gen === 'function') gen = gen();
	return new Promise(function (res, rej) {
		void function x(err, val) {
			try { var obj = err ? gen.throw(err) : gen.next(val); }
			catch (e) { return rej(e); }
			if (val = obj.value, obj.done) res(val);
			else valuecb(val, x);
		} ();
	});
}
