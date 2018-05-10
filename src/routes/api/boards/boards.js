const express = require('express');
const router = express.Router();
const app = express();
const pools = require('./pools/pools');
const init = require('../../../../initialize');
const threads = require('./threads/threads');

router.get('/api/boards', function(request, response, next){
	response.send('this is your boards api endpoint');
});

router.post('/api/boards/add', function(request, response, next){
	var object = {};
	console.log('body request in route: ' + JSON.stringify(request.body));
	init.setup_webpage_object(object, request, function(object){
		init.create_board(object, function(object){

			response.send(JSON.stringify(object.response_object));

		});
	});
});


module.exports = router;