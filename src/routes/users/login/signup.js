const express = require('express');
const init = require('../../../../initialize');
const router = express.Router();
const app = express();

router.get('/users/login/signup', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = 'Signup'
		response.render('signup', object);
	});
});

module.exports = router;