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

	setTimeoutFromStartTime( function() {
		display( times[ key ] );
	}, time );
}

function setTimeoutFromStartTime( cb, time ) {
	var start = date.clone().add( time, 'ms' );
	var callbackTime = start.diff( moment(), 'ms' );

	console.log( 'Next action in: ' + callbackTime + 'ms.' );

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
			case 'audio':
				loadAudio( path + '/' + data.audio );
				break;
			case 'colour':
				colour( data.colour );
				break;
			case 'video':
				loadVideo( path + '/' + data.video );
				break;
			case 'image':
				loadImage( path + '/' + data.image );
				break;
			case 'silence':
				silence();
				break;
			case 'blank':
				blank();
				break;
			default:
				silence();
				blank();
				break;
		}
	}
	prepareNext();
}

function loadImage( image ) {
	blank();
	jQuery( '#media' ).append( '<img src="' + image + '" class="fullscreen">' );
	console.log( 'loadImage( ' + image + ' )');
}

function loadVideo( video ) {
	blank();
	jQuery( '#media' ).append( '<video src="' + video +'" autoplay class="fullscreen"></video>' );
	console.log( 'loadVideo( ' + video + ' )');
}

function loadAudio( audio ) {
	silence();
	jQuery( '#audio' ).append( '<audio autoplay src="' + audio + '"></audio>' );
	console.log( 'loadAudio( ' + audio + ' )' );
}

function silence() {
	jQuery( '#audio' ).empty();
	console.log( 'silence()' );
}

function colour( colour ) {
	jQuery( '#media' ).empty();
	jQuery( 'body' ).css( 'background-color', colour );
	console.log( 'colour( ' + colour + ' )');
}

function blank() {
	colour( 'black' );
}

function finished() {
	blank();
	silence();
	keys = Object.keys( times ).reverse();
	console.log( 'finished()' );
}
