const express = require('express');
const router = express.Router();
const init = require('../../../initialize');
const app = express();


router.get('/boards/view/', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "Boards";
		response.render('boards/view', object);
	});
})

router.get('/boards/add', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "add board";
		response.render('boards/add', object);
	});
})

module.exports = router;