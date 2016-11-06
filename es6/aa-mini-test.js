'use strict';

const aa = require('./aa-mini');

exec(aa(main));

function *main() {
	console.log('1:', yield cb => setTimeout(cb, 200, null, 1));
	console.log('2:', yield cb => setTimeout(cb, 200, null, 2));
	console.log('3:', yield cb => setTimeout(cb, 200, null, 3));
	console.log('4:', yield Promise.resolve(4));
	console.log('[123]:', yield [
		cb => setTimeout(cb, 200, null, 1),
		Promise.resolve(2),
		cb => setTimeout(cb, 100, null,
		cb => setTimeout(cb, 100, null, 3))]);
	console.log('{xyz}:', yield {
		x: cb => setTimeout(cb, 200, null, 1),
		y: Promise.resolve(2),
		z: cb => setTimeout(cb, 300, null,
		cb => setTimeout(cb, 100, null, 3))});
	console.log('5:', yield cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, null, 5)));
	console.log('6:', yield Promise.resolve(Promise.resolve(6)));
	console.log('7:', yield function *() { return function *() { return 7; }; });
	console.log('8:', yield function *() { return function *() { return 8; } (); } ());
	console.log('*sub:', yield *sub('*sub'));
	console.log('sub:', yield sub('sub'));
}

function *sub(x) {
	console.log('1:', yield cb => setTimeout(cb, 200, null, 1));
	console.log('2:', yield cb => setTimeout(cb, 200, null, 2));
	console.log('3:', yield cb => setTimeout(cb, 200, null, 3));
	console.log('4:', yield Promise.resolve(4));
	console.log('[123]:', yield [
		cb => setTimeout(cb, 200, null, 1),
		Promise.resolve(2),
		cb => setTimeout(cb, 100, null,
		cb => setTimeout(cb, 100, null, 3))]);
	console.log('{xyz}:', yield {
		x: cb => setTimeout(cb, 200, null, 1),
		y: Promise.resolve(2),
		z: cb => setTimeout(cb, 300, null,
		cb => setTimeout(cb, 100, null, 3))});
	console.log('5:', yield cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, null, 5)));
	console.log('6:', yield Promise.resolve(Promise.resolve(6)));
	console.log('7:', yield function *() { return function *() { return 7; }; });
	console.log('8:', yield function *() { return function *() { return 8; } (); } ());
	return x;
}

function exec(x) {
	const val = x;
	if (typeof val === 'function') val();
}
