const express = require('express');
const init = require('../../../../initialize');
const router = express.Router();
const app = express();

router.get('/users/login', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		if(object.logged_in){
			object.title = "Logout";
		} else {
			object.title = "Login";
		}
		response.render('login', object);
	});
});

module.exports = router;