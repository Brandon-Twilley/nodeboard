const express = require('express');
const router = express.Router();
const init = require('../../../mysql_queries');
const app = express();
const mysql = require('mysql');



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
	init.setup_webpage_object(object, request, function(webpage_object){
		webpage_object.board = request.params.tagid;

		init.get_boards_shortname(webpage_object, function(webpage_object){
			webpage_object.title = "Board: " + webpage_object.board;
			response.render('thread/view', webpage_object);
		});
	});
});


router.get('/boards/add', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "add board";
		response.render('boards/add', object);
	});
});


module.exports = router;
