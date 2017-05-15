var socket = io();

jQuery( document ).ready( function() {
	jQuery( '#start' ).click( function() {
		console.log( 'Start...' );
		socket.emit( 'start' );
	} );
} );
