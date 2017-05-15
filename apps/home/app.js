var __root = '../..';
var __src = __root + '/src';
var __js = __src + '/js';

var	express = require( 'express' ),
	app = express();

var memory = {};

app.set( 'views', __dirname + '/views' );

app.get( '/', function ( req, res ) {
	res.render( 'index' );
} );

app.get( '/:a', function( req, res ) {
	if ( ! memory[req.params.a] ) return res.sendStatus( 404 );
	res.render( 'single', { path: req.params.a } );
} );

module.exports = function( config, m ) {
	memory = m;
	return app;
};
