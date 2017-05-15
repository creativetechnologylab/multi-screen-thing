var socket = io();

var path;

socket.on( 'connect', function() {
	console.log( 'connected' );
	socket.on( 'data', dataReceived );
} );

function dataReceived( msg ) {
	createModuleIfNotExists( msg.a );
	update_data( msg.a, msg.b, msg.data );
}

function createModuleIfNotExists( a ) {
	if ( ! moduleExists( a ) ) createModule( a );
}

function moduleExists( a ) {
	return jQuery( '.data' ).children( '[data-a="' + a + '"]' ).length ? true : false;
}

function createModule( a ) {
	var mod = jQuery( '<div style="display:none;" class="col-md-3 a-box" data-a="' + a + '"><h2>/' + a + '</h2><span></span></div>' );
	jQuery( '.data' ).append( mod );
	mod.fadeIn()
}

function update_data( a, b, data ) {
	var row = jQuery( '<h3>/' + b + ':</h3><pre>' + JSON.stringify( data ) + '</pre>' );
	jQuery( '.data [data-a="' + a + '"] span' ).html( row );
}
