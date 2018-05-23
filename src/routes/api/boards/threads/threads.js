const express = require('express');
const router = express.Router();
const init = require('../../../../../initialize');
const app = express();


router.get('/api/boards/threads', function(request, response, next){
	response.send('this is your threads api endpoint');
});

router.get('/api/threads/:board', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(webpage_object){
		webpage_object.board = request.params.board;
		init.get_threads(webpage_object, function(object){
			response.send(JSON.stringify(object.response_object));
		});
	});
});

router.get('/api/thread/:board/:thread', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(webpage_object){
		webpage_object.board = request.params.board;
		webpage_object.thread = request.params.thread
		init.get_comments(webpage_object, function(object){
			response.send(JSON.stringify(object.response_object));
		});
	});
});

router.post('/api/thread/:board/', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(webpage_object){
		webpage_object.board = request.params.board;
		webpage_object.thread = request.params.thread
		webpage_object.ip_address = request.connection.remoteAddress;
		init.post_comments(webpage_object, function(object){
			response.send(JSON.stringify(object.response_object));
		});
	});
});


router.post('/api/threads/:board', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(webpage_object){
		webpage_object.board = request.params.board;
		webpage_object.request_object.ip_address = request.connection.remoteAddress;
		init.post_threads(webpage_object, function(object){
			response.send(JSON.stringify(object.response_object));
		});
	});
});

module.exports = router;