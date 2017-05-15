var __root = '../..';
var __src = __root + '/src';
var __js = __src + '/js';

var	express = require( 'express' ),
	app = express();

var assets = {};

app.set( 'views', __dirname + '/views' );

app.get( '/:id', function ( req, res ) {
	res.render( 'index', { id: req.params.id } );
} );

module.exports = function( config ) {
	return app;
};
