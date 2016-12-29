'use strict';
const xssFilters = require('xss-filters');
const SocketIO = require('socket.io');
const redis = require('redis-connection')();
const pub      = require('redis-connection')();
const sub      = require('redis-connection')('subscriber');
let io;

function disconnectHandler() {
	console.log('ok i love you bye bye')
};

function newCommentHandler(message) {
	console.log(message);
	const sanitizedMessage = xssFilters.inHTMLData(message);

	// create comment JSON string
	const comment = JSON.stringify({
		msg: sanitizedMessage,
		time: new Date().getTime()
	});

	console.log(comment);
	// add new comment to the end of the redis list
	pub.rpush('chorus:comments', comment);

	// update the latest comment
	pub.publish('chorus:comments:latest', comment);
};

function socketsHandler(socket) {
	console.log('hello socket');
	socket.emit('chours:welcome', 'hello!');

	// disconnect event handler
	socket.on('disconnect', () => console.log('ok i love you bye bye'));

	// new comment handler
	socket.on('io:comments:new', newCommentHandler);
};


const loadComments = (req, reply) => {
	console.log('request made to load comments');
	redis.lrange('chorus:comments', 0, -1, (err, data) => {
		if (err) {
			console.log('OH NO redis can\'t load messages', err);
			return false;
		}

		return reply(data);
	});
};

const init = (listener, cb) => {
	pub.on('ready', () => {
		console.log('PUB READY');
		sub.on('ready', () => {
			sub.subscribe('chorus:comments:latest', 'chorus:users:new');

			// initialize io
			io = SocketIO.listen(listener);
			io.on('connection', socketsHandler);

			sub.on('message', (channel, message) => {
				io.emit(channel, message);
			});

			return setTimeout(() => {
				return cb();
			}, 300);
		});
	});
};

module.exports = {
	init: init,
	load: loadComments,
	redis: redis
};