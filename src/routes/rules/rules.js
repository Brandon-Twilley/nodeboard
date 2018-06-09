const express = require('express');
const fs = require('fs');
const router = express.Router();
const cookieParser = require('cookie-parser');
const init = require('../../../mysql_queries');





router.get('/rules', function(request, response) {
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "Rules";
		response.render('rules/rules', object);
	});
});

module.exports = router;