// minimum implementation of aa. aa(gtor)
'use strict';

module.exports = aa;
aa.callback = callback;

const GenProto = function *() {} ().constructor;
const GenFunc = function *() {}.constructor;

function callback(gfn) {
	return function() {
		return gtor2thunk(gfn.apply(this, arguments))();
	};
}

function cbvalue(cb) {
	return (err, val) =>
		err ? cb(err) :
		valuecb(val, cb);
}

function valuecb(val, cb) {
	if (!val) return cb(null, val);
	if (val.constructor !== Function && (
		val.constructor === GenFunc ||
		val.constructor === GenProto &&
		typeof val.next === 'function')) val = gtor2thunk(val);
	if (val.constructor === Array) {
		if (val.some(x => x && (typeof x === 'function' ||
				typeof x.then === 'function' ||
				x.constructor === GenProto &&
				typeof x.next === 'function')))
			val = array2thunk(val);
	}
	if (val.constructor === Object) {
		const keys = Object.keys(val);
		if (keys.some(x => val[x] && (typeof val[x] === 'function' ||
				typeof val[x].then === 'function' ||
				val[x].constructor === GenProto &&
				typeof val[x].next === 'function')))
			val = object2thunk(val);
	}
	if (typeof val === 'function') return val(cbvalue(cb));
	if (typeof val.then === 'function')
		return val.then(val => valuecb(val, cb), cb);
	cb(null, val);
}

function array2thunk(arr) {
	return cb => {
		let n = arr.length;
		if (n === 0) return cb(null, arr);
		const res = new Array(arr.length);
		arr.forEach((val, i) => {
			const x = (err, val) =>
				err ? ((n > 0 && cb(err)), (n = 0)) :
				((res[i] = val), (--n || valuecb(res, cb)));
			valuecb(val, x);
		});
	};
}

function object2thunk(obj) {
	return cb => {
		const keys = Object.keys(obj);
		let n = keys.length;
		if (n === 0) return cb(null, obj);
		const res = keys.reduce((a, b) => (a[b] = void 0, a), {});
		keys.forEach(key => {
			let val = obj[key];
			const x = (err, val) =>
				err ? ((n > 0 && cb(err)), (n = 0)) :
				((res[key] = val), (--n || valuecb(res, cb)));
			valuecb(val, x);
		});
	};
}

function aa(gen) {
	if (typeof gen === 'function') gen = gen();
	return new Promise((res, rej) => function x(err, val) {
		try { var obj = err ? gen.throw(err) : gen.next(val); }
		catch (e) { return rej(e); }
		if (val = obj.value, obj.done) return res(val);
		valuecb(val, x);
	} ());
}

function gtor2thunk(gen) {
	if (typeof gen === 'function') gen = gen();
	return cb => function x(err, val) {
		try { var obj = err ? gen.throw(err) : gen.next(val); }
		catch (e) { if (cb) return cb(e); console.error(e); throw e; }
		if (val = obj.value, obj.done) return cb && valuecb(val, cb);
		valuecb(val, x);
	} ();
}
