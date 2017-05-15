var __home = __dirname + '/../..';
var __src = __home + '/src';
var __js = __src + '/js';

var moment = require( 'moment' );
var sio = require( 'socket.io' );
var io;
var assets = {};

module.exports = function( http, a ) {
	assets = a;
	io = sio( http );
	io.on( 'connection', connected );
	return io;
};

function connected( socket ) {
	socket.on( 'start', function() {
		console.log( 'Starting playback...' );
		var time = moment();
		time.add( 3, 'seconds' );
		io.emit( 'start', time.toDate() );
	} );
}
