var __home = __dirname + '/../..';
var __src = __home + '/src';
var __js = __src + '/js';

var sio = require( 'socket.io' );
var memory = {};

module.exports = function( http, m ) {
	memory = m;
	var io = sio( http );
	io.on( 'connection', connected );
	return io;
};

function connected( socket ) {

}
