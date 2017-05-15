var __home = __dirname + '/../..';
var __src = __home + '/src';
var __js = __src + '/js';

var sio = require( 'socket.io' );
var assets = {};

module.exports = function( http, a ) {
	assets = a;
	var io = sio( http );
	io.on( 'connection', connected );
	return io;
};

function connected( socket ) {
	socket.on( 'start', function() {
		console.log( 'Starting playback...' );
		var time = new Date();
	} );
}
