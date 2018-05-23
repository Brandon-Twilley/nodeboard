const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/api/users/login', function(request, response, next){
	response.send('this is my api endpoint');
});

router.post('/api/users/login', function(request, response, next){
	
	
	let post_request = request.body;
	let query = [];
	let response_object = {};
	response_object.success = true;
	response_object.message = "";

	var con = mysql.createConnection({
				host: "root",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});
	
	query.push(post_request.username);
	
	con.connect(function(err){
		if (err) throw err;
		
		con.query("SELECT * FROM users WHERE username = ?;", query, function(err, result){
			if (err) throw err;
			
			if(result.length == 0){
				response_object.message = "Username not found";
				response_object.success = false;
				
				response.send(JSON.stringify(response_object));
				
			} else if(result.length == 1) {
				if(result[0].password != post_request.password){
					response_object.message = "Password incorrect";
					response_object.success = false;
					
					response.send(JSON.stringify(response_object));
					
				} else if(result[0].is_banned == 1){
					response_object.message = "You are banned!! >:(";
					response_object.success = false;
					
					response.send(JSON.stringify(response_object));
					
				} else {
					response_object.message = "Login Successful";
					response_object.success = true;
					
					response.send(JSON.stringify(response_object));
				}
			}
		});
	});
})


module.exports = router;