var __root = __dirname;
var __config = __root + '/config/config.json';
var __static = __root + '/static';
var __src = __root + '/src';
var __views = __src + '/views';
var __js = __src + '/js';

var config = require( __config );

var asset = {};

var express = require( 'express' ),
	app = express(),
	http = require( 'http' ).Server( app ),
	body = require( 'body-parser' ),
	app_loader = require( __js + '/app-loader' );

var io = require( __js + '/socket.js' )( http, memory );

console.log( "Starting..." );

// Setup static route
app.use( express.static( __static ) );

// Use PUG to render pages
app.set( 'views', __views );
app.set( 'view engine', 'pug' );
app.set( 'view cache', false );

// Load body-parser
app.use( body.urlencoded( { extended: true } ) );
app.use( body.json() );

// Load apps
app_loader( app, memory, io );

// Start server
var listener = http.listen( config.port ,config.host, function () {
	console.log( "Server started on: " + listener.address().address + ':' + listener.address().port );
} );
