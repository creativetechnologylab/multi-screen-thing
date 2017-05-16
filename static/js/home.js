var socket = io();

jQuery( document ).ready( function() {
	jQuery( '#start' ).click( function() {
		console.log( 'Start...' );
		socket.emit( 'start' );
	} );
	jQuery( '#reload' ).click( function() {
		socket.emit( 'reload' );
	} );
} );
