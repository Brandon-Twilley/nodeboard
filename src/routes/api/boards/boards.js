const express = require('express');
const router = express.Router();
const app = express();
const pools = require('./pools/pools');
const init = require('../../../../mysql_queries');
const threads = require('./threads/threads');
const bodyParser = require('body-parser');
const fs = require('fs');

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
     var form = new formidable.IncomingForm();

     // specify that we want to allow the user to upload multiple files in a single request
     form.multiples = false;

     // store all uploads in the /uploads directory
     form.uploadDir = path.join(__dirname, '/uploads');

     // every time a file has been uploaded successfully,
     // rename it to it's orignal name
     form.on('file', function(field, file) {
       fs.rename(file.path, path.join(form.uploadDir, file.name));
     });

     // log any errors that occur
     form.on('error', function(err) {
       console.log('An error has occured: \n' + err);
     });

     // once all the files have been uploaded, send a response to the client
     form.on('end', function() {
       res.end('success');
     });

     // parse the incoming request containing the form data
     form.parse(req);

});
/*
router.post('/api/boards/upload', function(req, res){
     let form = new formidable.IncomingForm();
     form.uploadDir = __dirname + '/image_store';
     form.encoding = 'binary';

     form.addListener('file', function(name, file){
          //do something once the file is uploaded
     });

     form.addListener('end', function(){
          res.end();
     });

     form.parse(req, function(err, fields, files){
          if(err){
               console.log(err);
          }
     })
     res.send('ping pong');
});*/



module.exports = router;
