const express = require('express');
const router = express.Router();
const app = express();
const pools = require('./pools/pools');
const init = require('../../../../mysql_queries');
const threads = require('./threads/threads');
const bodyParser = require('body-parser');
const domain = require('domain');
const path = require('path');
const fs = require('fs');
const imgur = require('imgur-node-api');
const credentials = require('../../../../credentials');
imgur.setClientID(credentials.imgurClientID);


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

router.post('/api/boards/upload', function(req, res, next){
	// create an incoming form object
	var d = domain.create();
	console.log('received upload');
	d.on('error', console.error);
	d.run(function() {
		var file_name = req.body.file_name + ".jpeg";
		var target_path = path.join('image_store', file_name);
		var bitmap = new Buffer(req.body.imgData, 'base64');

		// write buffer to file
		//fs.writeFileSync(target_path, bitmap);
		//fs.writeFileSync(target_path, bitmap);
		fs.writeFile(target_path, bitmap, function(){
			imgur.upload(path.join(__dirname + '../../../../../image_store', file_name), function(err, imgur_response){
		          console.log('link: ', imgur_response.data.link);
		          image_url = imgur_response.data.link;
				console.log('image url: ' + image_url);
				init.set_image_url(image_url, req.body.board, req.body.thread, req.body.file_name);
				res.send(image_url);
				console.log('replied to upload');

		     });
		});
		// create an incoming form object
	});
});



module.exports = router;
