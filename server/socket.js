'use strict';
const xssFilters = require('xss-filters');
const SocketIO   = require('socket.io');
const redis      = require('redis-connection')();
const pub        = require('redis-connection')();
const sub        = require('redis-connection')('subscriber');
const moment     = require('moment');
let io;
let ioSocket;

function socketsHandler(socket) {
	ioSocket = socket;

	// disconnect event handler
	ioSocket.on('disconnect', () => console.log('ok i love you bye bye'));

	// new user handler
	ioSocket.on('io:users:new', newUserHandler);

	// new comment handler
	ioSocket.on('io:comments:new', newCommentHandler);
};


function newUserHandler(username) {
	// add user to users list
	pub.hset('users', ioSocket.client.conn.id, username);

	pub.hget('users', ioSocket.client.conn.id, (err, username) => {
		if (err) {
			console.log('OH NO in newUserHandler', err);
			return false;
		}
	})
	// don't think i need to publish new users right now..
	// pub.publish('chorus:users:new', name);
}

function newCommentHandler(message) {
	const sanitizedMessage = xssFilters.inHTMLData(message);

	pub.hget('users', ioSocket.client.conn.id, (err, username) => {
		if (err) {
			console.log('OH NO couldn\'t get user for new message');
			return false;
		}

		const timestamp = moment().unix();

		// create comment JSON string
		const comment = JSON.stringify({
			msg: sanitizedMessage,
			username: username,
			timestamp: timestamp,
			time: moment(timestamp).format('h:mm:ss a')
		});

		// add new comment to the end of the redis list
		pub.rpush('chorus:comments', comment);

		// update the latest comment
		pub.publish('chorus:comments:latest', comment);
	});


};


const loadComments = (req, reply) => {
	redis.lrange('chorus:comments', 0, -1, (err, data) => {
		if (err) {
			console.log('OH NO redis can\'t load messages', err);
			return false;
		}

		return reply(data);
	});
};


function disconnectHandler() {
	console.log('ok i love you bye bye')
};


const init = (listener, cb) => {
	pub.on('ready', () => {
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