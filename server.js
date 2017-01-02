'use strict';
const Hapi   = require('hapi');
const inert  = require('inert');
const Good   = require('good');
const socket = require('./server/socket');
const HOST   = process.env.HOSTNAME;
const PORT   = process.env.NODE_PORT;

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
	host: HOST,
	port: PORT
});

server.register({
	register: Good,
	options: {
		reporters: {
			console: [{
				module: 'good-squeeze',
				name: 'Squeeze',
				args: [{
					response: '*',
					log: '*'
				}]
			}, {
				module: 'good-console'
			}, 'stdout']
		}
	}
}, (err) => {
	if (err) {
		console.log('OH NO Good module is broken', err); // something bad happened loading the plugin
	}
});

server.register(inert, (err) => {
	if (err) {
		throw err;
	}
});

server.route({
	method: 'GET',
	path: '/',
	handler: (request, reply) => reply.file('./public/index.html')
});

server.route({
	method: 'GET',
	path: '/comments',
	handler: socket.load
});

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: 'public'
		}
	}
});

// Start the server
server.start((err) => {
	if (err) {
		console.log('OH NO server not started', err);
	}

	socket.init(server.listener, () => {
		console.log(`socket.io listening on http://127.0.0.1:${PORT}`);
	});
});