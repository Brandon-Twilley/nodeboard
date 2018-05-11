const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


exports.setup_webpage_object = function(webpage_object, request, callback){
	var webpage_object;
	fs.readFile('./src/json_data/globals.json', 'utf8', function(err, data){
		if (err) throw err;
		webpage_object = JSON.parse(data);
		
		
		let cookies_request = request.cookies;
		let query = [];
		let success_message = {};
		webpage_object.request_object = request.body;
		console.log('request.body: ' + JSON.stringify(webpage_object.request_object));
		webpage_object.success_message.success = true;
		webpage_object.success_message.message = "";
		console.log(JSON.stringify(cookies_request));
		
		if(cookies_request.username == ''){
			callback(webpage_object);
			return;
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
						webpage_object.success_message.message = "Username not found";
						webpage_object.success_message.success = false;
						
						webpage_object.logged_in = false;
						
					} else if(result.length == 1) {
						if(result[0].password != cookies_request.password){
							webpage_object.success_message.message = "Password incorrect";
							webpage_object.success_message.success = false;
							
							webpage_object.logged_in = false;
							
						} else if(result[0].is_banned == 1){
							webpage_object.success_message.message = "You are banned!! >:(";
							webpage_object.success_message.success = false;
							
							webpage_object.logged_in = false;
							
						} else {
							webpage_object.username = query[0];
							webpage_object.success_message.message = "Login Successful";
							webpage_object.success_message.success = true;
							
							webpage_object.logged_in = true;
							webpage_object.username = result[0].username;

							
						}
					}
					
					console.log('logged in: ' + webpage_object.logged_in);
					console.log(JSON.stringify(webpage_object.response_object));
					callback(webpage_object);
				});
			});
		}
	});
}


exports.get_threads_comments = function(webpage_object, callback){
	if(webpage_object.success_message.success){
		webpage_object.response_object.thread = {
			"main_post": {
				"id": "",
				"title": "",
				"comment": "",
				"poster": "",
				"main_post_images": [],
				"timestamp": "",
				"thread_UUID": "",
				"ip_address": "",
				"images": []
			},
			"comments": []
		};

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
					webpage_object.response_object.thread.comments.push({
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

				console.log(JSON.stringify(webpage_object));
				
				callback(webpage_object);
				return;
			});
		});
	} else {
		callback(webpage_object);
		return;
	}
}
/*
exports.get_threads = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
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

}*/

exports.create_board = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		if(webpage_object.username != ""){
			var query = [];
			let username_query = [];

			var con = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				database: 'node_imageboard'
			});
			
			
			
			con.connect(function(err){
				if (err) throw err;

				query.push(webpage_object.request_object.name);
				query.push(webpage_object.request_object.imageheader);
				query.push(webpage_object.request_object.shortname);
				query.push(webpage_object.request_object.description);
				
					//get the username id index of the user creating this board.
				con.query("SELECT * FROM users WHERE username = ?;", [webpage_object.username], function(err, result){
					console.log('user: ' + JSON.stringify(result[0]));
					if (err) throw err;

					if(result.length != 1){
						if(result.length == 0){
							webpage_object.success_message.success = false;
							webpage_object.success_message.message = "Username not found";
						} else {
							webpage_object.success_message.success = false;
							webpage_object.success_message.message = "Duplicate username error";
						}
						return;
					}
					query.push(result[0].id); 
					query.push(0);
					query.push(0);
					query.push("board_" + webpage_object.request_object.shortname);

						//check to see if there are duplicate boards, either in the name or the shortname.
						//If there are errors, report these to the success message in the webpage_object.
					if(webpage_object.success_message.success){

							//create an entry in the database that manages the boards
						con.query("INSERT INTO boards (name,imageheader,shortname,description,creator,board_post_count,board_reply_count,tablename) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? );", query, function(err, result){
							console.log('sql query: ' + this.sql);
							if  (err) {
								con.query("SELECT * FROM boards WHERE shortname = ?", [query[2]], function(result, err){
									if(result.length > 0){
										webpage_object.success_message.message = "Duplicate board: " + result[0].shortname;
										webpage_object.success_message.success = false;
									} else {
										con.query("SELECT * FROM boards WHERE name = ?", [query[0]], function(result, err){
											if(result.length > 0){
												webpage_object.success_message.message = "duplicate board main name at: " + result[0].name;
												webpage_object.success_message.success = false;
											} else {
												webpage_object.success_message.message = "There was an error with the server creating the board.  Contact the developer";
												webpage_object.success_message.success = false;

											}
										});
									}
								});
								throw err;
								callback(webpage_object);
								return;
							} else {
								console.log("result: " + JSON.stringify(result));
								return;
							}						
						});
						if(webpage_object.success_message.success){

							con.query("create table board_" + query[2] + " (id INT NOT NULL AUTO_INCREMENT , ip_address varchar(20) NOT NULL , comment_UUID varchar(32) NOT NULL , thread_UUID varchar(32) NOT NULL , poster_id INT , replies_UUID varchar(32) NOT NULL , replied_to_UUID varchar(32) NOT NULL , post text, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) );",
								function(err, result){
									if (err) {
										console.log('sql statement: ' + this.sql);
										throw err;
									} else {
										console.log("created board: " + query[0]);
										webpage_object.success_message.success = true;
										webpage_object.success_message.message = "Successfully created board";
										callback(webpage_object);
										return;
									}
								});
						}
					} else {
						callback(webpage_object);
						return;
					}
				});
			});
		} else {
			callback(webpage_object);
			return;
		}
	} else {
		callback(webpage_object);
		return;
	}
}

exports.get_boards_shortname = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		let query = [];

		query.push(webpage_object.request_object.shortname)

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			database: 'node_imageboard'
		})
		con.connect(function(err){
			if (err) throw err;

			con.query("SELECT * FROM boards WHERE shortname = ?;", query, function(err, result){
				if (err) throw err;
				webpage_object.success_message.success = true;
				webpage_object.success_message.message = "";
				webpage_object.response_object = {boards: result};
				console.log('ping 1');
				callback(webpage_object);
				return;
			
			});
		});
	} else {
		callback(webpage_object);
		return;
	}
}

exports.get_boards = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			database: 'node_imageboard'
		})
		con.connect(function(err){
			if (err) throw err;

			con.query("SELECT * FROM boards ORDER BY board_post_count LIMIT 15;", function(err, result){
				if (err) throw err;
				webpage_object.success_message.success = true;
				webpage_object.success_message.message = "";
				webpage_object.response_object = {boards: result};
				callback(webpage_object);
				return;
			
			});
		});
	} else {
		callback(webpage_object);
		return;
	}
}

exports.get_threads = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		var query = [];

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			database: 'node_imageboard'
		});
		query.push(webpage_object.request_object.board);
		con.connect(function(err){
			if (err) throw err;

			con.query("SELECT * FROM boards WHERE shortname = ?;", query, function(err, result){
				if (err) throw err;

				if(result.length == 0){
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "There are no boards by that name";
					callback(webpage_object);
					return;
				} else if(result.length == 1){
					con.query("SELECT * FROM board_" + webpage_object.request_object.board + ";", function(err, result){
						if (err) throw err;

						webpage_object.response_object.threads = result;


						webpage_object.success_message.success = false;
						webpage_object.success_message.message = "There are no boards by that name";

						callback(webpage_object);

					});
				} else {
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "Internal server error";
					callback(webpage_object)
					return;
				}
			
			});
		});
	} else {
		callback(webpage_object);
		return;
	}
}
/*
exports.post_threads = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		var query = [];

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			database: 'node_imageboard'
		});
		query.push(webpage_object.request_object.board);
		con.connect(function(err){
			if (err) throw err;

			con.query("SELECT * FROM boards WHERE shortname = ?;", query, function(err, result){
				if (err) throw err;

				if(result.length == 0){
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "There are no boards by that name";
					callback(webpage_object);
					return;
				} else if(result.length == 1){
					con.query("SELECT * FROM board_" + webpage_object.request_object.board + ";", function(err, result){
						if (err) throw err;

						webpage_object.response_object.threads = result;


						webpage_object.success_message.success = false;
						webpage_object.success_message.message = "There are no boards by that name";

						callback(webpage_object);

					});
				} else {
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "Internal server error";
					callback(webpage_object)
					return;
				}
			
			});
		});
	} else {
		callback(webpage_object);
		return;
	}

}*/