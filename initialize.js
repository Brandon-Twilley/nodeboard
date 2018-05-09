const fs = require('fs');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');


exports.setup_webpage_object = function(webpage_object, request, callback){
	var webpage_object;
	fs.readFile('./src/json_data/globals.json', 'utf8', function(err, data){
		if (err) throw err;
		webpage_object = JSON.parse(data);
		
		
		let cookies_request = request.cookies;
		let query = [];
		let response_object = {};
		response_object.success = true;
		response_object.message = "";
		console.log(JSON.stringify(cookies_request));
		
		if(cookies_request.username == ''){
			callback(webpage_object);
		} else {
			var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				database: "node_imageboard",
			});
			
			query.push(cookies_request.username);
			
			con.connect(function(err){
				if (err) throw err;
				
				con.query("SELECT * FROM users WHERE username = ?;", query, function(err, result){
					if (err) throw err;
					
					if(result.length == 0){
						response_object.message = "Username not found";
						response_object.success = false;
						
						webpage_object.logged_in = false;
						
					} else if(result.length == 1) {
						if(result[0].password != cookies_request.password){
							response_object.message = "Password incorrect";
							response_object.success = false;
							
							webpage_object.logged_in = false;
							
						} else if(result[0].is_banned == 1){
							response_object.message = "You are banned!! >:(";
							response_object.success = false;
							
							webpage_object.logged_in = false;
							
						} else {
							response_object.message = "Login Successful";
							response_object.success = true;
							
							webpage_object.logged_in = true;
							webpage_object.username = result[0].username;
							
						}
					}
					
					console.log('logged in: ' + webpage_object.logged_in);
					
					callback(webpage_object);
				});
			});
		}
	});
}

/*
"thread": {
	"main_post": {
		"id": "",
		"title": "",
		"comment": "",
		"poster": "",
		"main_post_images": [],
		"timestamp": "",
		"thread_UUID": "",
		"ip_address": "",
		"images": ""
	},
	
	"comments": [
		{
			"post_number": "",
			"comment_UUID": "",
			"thread_UUID": "",
			"poster_id": "",
			"replies": [],
			"replied_to": [],
			"post": "",
			"timestamp": ""
		}
	]
},
*/
exports.get_threads_comments = function(webpage_object, request, callback){
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		database: "node_imageboard"
	});
	
	//query.push(cookies_request.username);
	
	con.connect(function(err){
		if (err) throw err;
		
		con.query("SELECT * FROM thread_comments_sample;", /*query,*/ function(err, result){
			if (err) throw err;
			var i;
			for(i = 0; i < result.length; i++){
				webpage_object.thread.comments.push({
						"id": result[i].id, 
						"comment_UUID": result[i].comment_UUID, 
						"thread_UUID": result[i].thread_UUID, 
						"poster_id": result[i].poster_id, 
						"replies": result[i].replies_UUID,
						"replied_to": result[i].replied_to_UUID,
						"post": result[i].post,
						"timestamp": result[i].timestamp
					});
			}
			
			callback(webpage_object);
		});
	});
}

exports.get_threads = function(webpage_object, request, callback){
	
	var con = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'node_imageboard'
	});
	
	con.connect(function(err){
		if (err) throw err;
		
		con.query()
	});
}