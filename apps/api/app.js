var __root = '../..';
var __src = __root + '/src';
var __js = __src + '/js';

var	express = require( 'express' ),
	app = express();

var memory = {};
var io;

app.set( 'views', __dirname + '/views' );

app.get( '/:a/:b', function ( req, res ) {
	if ( ! memory[req.params.a] ) return res.sendStatus( 404 );
	if ( ! memory[req.params.a][req.params.b] ) return res.sendStatus( 404 );
	res.json( memory[req.params.a][req.params.b] );
} );

app.post( '/:a/:b', function ( req, res ) {
	if ( ! memory[req.params.a] ) memory[req.params.a] = {};
	if ( ! memory[req.params.a][req.params.b] ) memory[req.params.a][req.params.b] = {};
	store( req.params.a, req.params.b, req.body );
	res.sendStatus(200);
} );

function store( a, b, d ) {
	memory[a][b] = d;
	console.log( {
		a: a,
		b: b,
		data: d
	} );
	io.emit( 'data', {
		a: a,
		b: b,
		data: d
	} );
}

app.get( '*', function ( req, res ) {
	res.sendStatus( 501 );
} );

module.exports = function( config, m, i ) {
	memory = m;
	io = i;
	return app;
};
