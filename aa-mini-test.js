'use strict';

const aa = require('./aa-mini');

exec(aa(main));

function *main() {
	const x = 'main';
	console.log(x + '1:', yield cb => setTimeout(cb, 200, null, 1));
	console.log(x + '2:', yield cb => setTimeout(cb, 200, null, 2));
	console.log(x + '3:', yield cb => setTimeout(cb, 200, null, 3));
	console.log(x + '4:', yield Promise.resolve(4));
	console.log(x + ' [1234]:', yield [
		cb => setTimeout(cb, 200, null, 1),
		Promise.resolve(2),
		cb => setTimeout(cb, 100, null,
		cb => setTimeout(cb, 100, null, 3)),
		cb => setTimeout(cb, 100, null,
			Promise.resolve(4))]);
	console.log(x + ' {xyzw}:', yield {
		x: cb => setTimeout(cb, 200, null, 1),
		y: Promise.resolve(2),
		z: cb => setTimeout(cb, 300, null,
			cb => setTimeout(cb, 100, null, 3)),
		w: cb => setTimeout(cb, 100, null,
			Promise.resolve(4))});
	console.log(x + '5:', yield cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, null, 5)));
	console.log(x + '6:', yield Promise.resolve(Promise.resolve(6)));
	console.log(x + '7:',
		yield function *() { return function *() { return 7; }; });
	console.log(x + '8:',
		yield function *() { return function *() { return 8; } (); } ());
	console.log(x + ' *sub:', yield *sub('*sub'));
	console.log(x + ' sub:', yield sub('sub'));
	console.log(x + ' *bomb:', yield *bomb('*bomb'));
	console.log(x + ' bomb:', yield bomb('bomb'));
}

function *sub(x) {
	console.log(x + '1:', yield cb => setTimeout(cb, 200, null, 1));
	console.log(x + '2:', yield cb => setTimeout(cb, 200, null, 2));
	console.log(x + '3:', yield cb => setTimeout(cb, 200, null, 3));
	console.log(x + '4:', yield Promise.resolve(4));
	console.log(x + ' [1234]:', yield [
		cb => setTimeout(cb, 200, null, 1),
		Promise.resolve(2),
		cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, null, 3)),
		cb => setTimeout(cb, 100, null,
			Promise.resolve(4))]);
	console.log(x + ' {xyzw}:', yield {
		x: cb => setTimeout(cb, 200, null, 1),
		y: Promise.resolve(2),
		z: cb => setTimeout(cb, 300, null,
			cb => setTimeout(cb, 100, null, 3)),
		w: cb => setTimeout(cb, 100, null,
			Promise.resolve(4))});
	console.log(x + '5:', yield cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, null, 5)));
	console.log(x + '6:', yield Promise.resolve(Promise.resolve(6)));
	console.log(x + '7:',
		yield function *() { return function *() { return 7; }; });
	console.log(x + '8:',
		yield function *() { return function *() { return 8; } (); } ());
	return x;
}

function *bomb(x) {
	try { console.log(x + '1:',
		yield cb => setTimeout(cb, 200, new Error('1')));
	} catch (e) { console.log(x + '1: ' + e); }
	try { console.log(x + '2:',
		yield cb => setTimeout(cb, 200, new Error('2')));
	} catch (e) { console.log(x + '2: ' + e); }
	try { console.log(x + '3:',
		yield cb => setTimeout(cb, 200, new Error('3')));
	} catch (e) { console.log(x + '3: ' + e); }
	try { console.log(x + '4:', yield Promise.reject(new Error('4')));
	} catch (e) { console.log(x + '4: ' + e); }
	try { console.log(x + ' [1234]:', yield [
		cb => setTimeout(cb, 200, null, 1),
		Promise.resolve(2),
		cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, new Error('[3]'))),
		cb => setTimeout(cb, 300, null,
			Promise.reject(new Error('[4]')))]);
	} catch (e) { console.log(x + ' [1234]: ' + e); }
	try { console.log(x + ' {xyzw}:', yield {
		x: cb => setTimeout(cb, 200, null, 1),
		y: Promise.resolve(2),
		z: cb => setTimeout(cb, 300, null,
			cb => setTimeout(cb, 100, new Error('{3}'))),
		w: cb => setTimeout(cb, 100, null,
			Promise.resolve(4))});
	} catch (e) { console.log(x + ' {xyzw}: ' + e); }
	try { console.log(x + '5:', yield cb => setTimeout(cb, 100, null,
			cb => setTimeout(cb, 100, new Error('5'))));
	} catch (e) { console.log(x + '5: ' + e); }
	try { console.log(x + '6:',
		yield Promise.resolve(Promise.reject(new Error('6'))));
	} catch (e) { console.log(x + '6: ' + e); }
	try { console.log(x + '7:',
		yield function *() {
			return function *() { throw new Error('7'); }; });
	} catch (e) { console.log(x + '7: ' + e); }
	try { console.log(x + '8:',
		yield function *() {
			return function *() { throw new Error('8'); } (); } ());
	} catch (e) { console.log(x + '8: ' + e); }
	return x;
}

function exec(val) {
	if (typeof val === 'function')
		val();
	else if (val && val.then)
		val.then(v => console.log(v), e => console.error(e));
}
