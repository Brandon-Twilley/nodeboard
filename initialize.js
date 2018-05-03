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
