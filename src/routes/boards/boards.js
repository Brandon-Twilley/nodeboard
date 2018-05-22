const express = require('express');
const router = express.Router();
const init = require('../../../initialize');
const app = express();


router.get('/boards/view/', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(webpage_object){
		init.get_boards(webpage_object, function(object){

			object.title = "Boards";
			console.log('response object before rendering: ' + JSON.stringify(object.response_object));
			response.render('boards/view', object);
		});
	});
});

router.get('/boards/view/:tagid', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.board = request.params.tagid;
		console.log('before get_threads: ' + JSON.stringify(object.board));
		init.get_threads(object, function(object){
			object.title = "Boards";
			console.log(JSON.stringify(object));
			response.render('thread/view', object);
		});
	});
});

router.get('/boards/add', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "add board";
		response.render('boards/add', object);
	});
})

module.exports = router;