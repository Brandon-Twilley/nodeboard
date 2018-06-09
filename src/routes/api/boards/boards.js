const express = require('express');
const router = express.Router();
const app = express();
const pools = require('./pools/pools');
const init = require('../../../../mysql_queries');
const threads = require('./threads/threads');
const bodyParser = require('body-parser');
const util = require('util');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.post('/api/boards', function(request, response, next){
	var object = {};
	init.setup_webpage_object(object, request, function(webpage_object){
		if('shortname' in webpage_object.request_object){
			init.get_boards_shortname(webpage_object, function(object){
				console.log('webpage object: ' + JSON.stringify(object));
				console.log('ping2');
				response.send(JSON.stringify(object.response_object));
			});
		} else {
			console.log(JSON.stringify(webpage_object.request_object));
			webpage_object.success_message.success = false;
			webpage_object.success_message.message = "Appropriate values haven't been set";
			response.send(JSON.stringify(webpage_object.success_message));
		}
	});
});

router.post('/api/boards/add', function(request, response, next){
	var object = {};
	console.log('body request in route: ' + JSON.stringify(request.body));
	init.setup_webpage_object(object, request, function(webpage_object){
		init.create_board(webpage_object, function(webpage_object){
			if(webpage_object.success_message.success){
				response.send(JSON.stringify(webpage_object.response_object));
			} else {
				response.send(JSON.stringify(webpage_object.success_message));
			}
		});
	});
});

router.post('/api/boards/upload', function(request, response, next){
	// create an incoming form object
	console.log('file info: ',req.files.image);

	
});



module.exports = router;
