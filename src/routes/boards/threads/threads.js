const express = require('express');
const router = express.Router();
const init = require('../../../../initialize');
const app = express();

router.get('/boards/threads', function(request, response, next){
	response.send('this is my board threads endpoint');
}); 

router.get('/thread', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(object){
		object.title = "Thread";
		init.get_threads_comments(object, request, function(object){
			console.log(JSON.stringify(object.thread));
			response.render('thread/view', object);
		});
	});
})

module.exports = router;