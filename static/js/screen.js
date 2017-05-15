var socket = io();

socket.on( 'start', function( msg ) {
	alert( msg );
} );
