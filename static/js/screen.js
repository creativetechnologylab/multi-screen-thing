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
	var time = parseInt( parseFloat( key.split( ':' )[0] * 60 ) + parseFloat( key.split( ':' )[1] ) ) * 1000;

	setTimeoutFromStartTime( function() {
		console.log( key );
		display( times[ key ] );
	}, time );
}

function setTimeoutFromStartTime( cb, time ) {
	var start = date.clone().add( time, 'ms' );
	var callbackTime = start.diff( moment(), 'ms' );

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
				loadAudio( path + '/' + data.audio, data.volume );
				break;
			case 'colour':
				colour( data.colour );
				break;
			case 'video':
				loadVideo( path + '/' + data.video, data.volume );
				break;
			case 'volume':
				if ( isNumber( data.audio ) ) audioVolume( data.audio, data.speed );
				if ( isNumber( data.video ) ) videoVolume( data.video, data.speed );
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

function loadVideo( video, volume ) {
	blank();
	var v = jQuery( '<video src="' + video +'" autoplay class="fullscreen"></video>' );
	jQuery( '#media' ).append( v );
	if ( volume ) jQuery( v ).prop( 'volume', volume );
	console.log( 'loadVideo( ' + video + ' )');
}

function videoVolume( volume, speed ) {
	if ( speed ) {
		jQuery( '#media video' ).animate( { volume: volume }, speed );
	} else {
		jQuery( '#media video' ).prop( 'volume', volume );
	}
	console.log( 'videoVolume( ' + volume + ' )');
}

function loadAudio( audio, volume ) {
	silence();
	var a = jQuery( '<audio autoplay src="' + audio + '"></audio>' );
	jQuery( '#audio' ).append( a );
	if ( volume ) jQuery( a ).prop( 'volume', volume );
	console.log( 'loadAudio( ' + audio + ' )' );
}

function audioVolume( volume, speed ) {
	if ( speed ) {
		jQuery( '#audio audio' ).animate( { volume: volume }, speed );
	} else {
		jQuery( '#audio audio' ).prop( 'volume', volume );
	}
	console.log( 'audioVolume( ' + volume + ' )');
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

function isNumber( n ) {
	return Number(n) === n;
}
