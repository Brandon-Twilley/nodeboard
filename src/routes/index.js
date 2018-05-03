const express = require('express');
const init = require('../../initialize');
const router = express.Router();

router.get('/', function(request, response) {
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "node-imageboard"
		response.render('index', object);
	});
});

module.exports = router;