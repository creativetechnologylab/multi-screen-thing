var socket = io();

var date;
var timer;

var path = '/assets/';

var times = {};
var keys = [];

jQuery( document ).ready( function() {
	path += jQuery( '#id' ).data( 'id' );
	jQuery.get( path + '/time.json', processData );
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

socket.on( 'reload', function() {
	location.reload();
} );

function prepareNext() {
	if ( keys.length < 1 ) return finished();

	var key = keys.pop();
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
	if ( callbackTime <= 0 ) return prepareNext();

	if ( timer ) {
		clearTimeout( timer );
		timer = null;
	}
	timer = setTimeout( cb, callbackTime );
}

function display( data ) {
	if ( data.type ) {
		switch ( data.type ) {
			case 'image-with-audio':
				loadImageWithAudio( path + '/' + data.image, path + '/' + data.audio );
				break;
			case 'colour':
				colour( data.colour );
				break;
			case 'video':
				loadVideo( path + '/' + data.url );
				break;
			case 'image':
				loadImage( path + '/' + data.url );
				break;
			case 'blank':
			default:
				blank();
				break;
		}
	}
	prepareNext();
}

function loadImage( image ) {
	blank();
	jQuery( '#mediaContainer' ).append( '<img src="' + image + '" class="fullscreen">' );
	console.log("loadImage(" + image + ")");
}

function loadVideo( video ) {
	blank();
	jQuery( '#mediaContainer' ).append( '<video src="' + video +'" autoplay class="fullscreen"></video>' );
	console.log("loadVideo(" + video + ")");
}

function loadAudio( audio ) {
	blank();
	jQuery( '#mediaContainer' ).append( '<audio autoplay src="' + audio + '"></audio>' );
	console.log("loadAudio(" + audio + ")");
}

function loadImageWithAudio( image, audio ) {
	blank();
	jQuery( '#mediaContainer' ).append( '<audio autoplay src="' + audio + '"></audio>' );
	jQuery( '#mediaContainer' ).append( '<img src="' + image + '" class="fullscreen">' );
	console.log("loadImageWithAudio(" + image + ", " + audio + ")");
}

function colour( colour ) {
	jQuery( '#mediaContainer' ).empty();
	jQuery( 'body' ).css( 'background-color', colour );
	console.log( "colour( " + colour + " )");
}

function blank() {
	colour( 'black' );
}

function finished() {
	blank();
	keys = Object.keys( times ).reverse();
	console.log( 'finished' );
}
