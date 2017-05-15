var __root = __dirname + '/../..';
var __config = __root + '/config/config.json';
var __apps = __root + '/apps';
var __src = __root + '/src';
var __js = __src + '/js';

var config = require( __config );

var fs = require( 'fs' );

var app;
var apps = [];
var memory = {};
var io;

module.exports = function( a, m, i ) {
	// Grab the express app reference locally
	app = a;
	memory = m;
	io = i;

	// Loop through main app director contents
	loadApps();

	// Route apps
	routeApps();

	// Error 404
	app.use( function ( req, res, next ) {
		res.status( 404 );
		res.render( '404' );
	} );

	// Error 500
	app.use( function ( err, req, res, next ) {
		res.status( 500 );
		res.render( '500', { error: err.stack } );
	} );
};

function loadApps() {
	var files = fs.readdirSync( __apps );

	for ( var f in files ) {

		// Only read directories
		var file = __apps + '/' + files[f];
		if ( fs.statSync( file ).isDirectory() ) {

			// Check for a config.json file
			var config_file = file + '/config.json';
			if ( fs.existsSync( config_file ) ) {

				// Parse the config into apps array
				var output = JSON.parse( fs.readFileSync( config_file ) );
				output.uid = files[f];
				if ( output.priority === undefined ) output.priority = 100;
				output.app = file + '/app.js';

				apps.push( output );
			}
		}
	}
}

function routeApps() {
	for ( var a in apps ) {
		var _app = apps[a];
		console.log( "	Route: /" + _app.path );

		var new_app = require( _app.app )( _app, memory, io );
		app.use( '/' + _app.path, new_app );
	}
}
