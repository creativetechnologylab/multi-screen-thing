var socket = io();

var date;
var timer;

var times = {};
var keys = [];

jQuery( document ).ready( function() {
	var path = '/assets';
	var id = jQuery( '#id' ).data( 'id' );
	jQuery.get( path + '/' + id + '/time.json', processData );
} );

function processData( data ) {
	console.log( 'Loaded Data' );
	times = data.times;
	keys = Object.keys( times ).reverse();
}

socket.on( 'start', function( msg ) {
	console.log( 'Start' );
	date = moment( msg );
	prepareNext();
} );

function prepareNext() {
	if ( keys.length < 1 ) return finished();

	var key = keys.pop()
	var time = key * 1000;

	console.log( 'Preparing for next: ' + time );

	setTimeoutFromStartTime( function() {
		display( times[ key ] );
	}, time );
}

function setTimeoutFromStartTime( cb, time ) {
	var start = date.clone().add( time, 'ms' );
	var callbackTime = start.diff( moment(), 'ms' );

	console.log( callbackTime );

	// Skip if this is in the past
	if ( time <= 0 ) return prepareNext();

	if ( timer ) {
		clearTimeout( timer );
		timer = null;
	}
	timer = setTimeout( cb, callbackTime );
}

function display( data ) {
	if ( data.type ) {
		switch ( data.type ) {
			case 'video':
				loadVideo( data.url );
				break;
			case 'image':
				loadImage( data.url );
				break;
			case 'blank':
			default:
				blank();
				break;
		}
	}
	prepareNext();
}

function loadImage( src ) {
	console.log( src );
}

function loadVideo( src ) {
	console.log( src );
}

function blank() {
	console.log( 'blanked screen' );
}

function finished() {
	blank();
	keys = Object.keys( times ).reverse();
	console.log( 'finished' );
}
