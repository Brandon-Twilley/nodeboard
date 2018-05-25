const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const uuidv1 = require('uuid/v1');

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
		console.log('cookies: ' + JSON.stringify(cookies_request));
		console.log('request.body: ' + JSON.stringify(webpage_object.request_object));
		
		if(cookies_request.username == ''){
			callback(webpage_object);
			return;
		} else {
			var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});
			
			query.push(cookies_request.username);
			
			con.connect(function(err){
				if (err) throw err;
				
				con.query("SELECT * FROM users WHERE username = ?;", query, function(err, result){
					if (err) throw err;
					
					if(result.length == 0){
						webpage_object.success_message.message = "Username not found";
						webpage_object.success_message.success = true;
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
					con.end();
					return;
				});
			});
		}
	});
}

exports.get_comments = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		let query = [];
		query.push(webpage_object.thread);
		query.push(webpage_object.board);
		var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});



		con.connect(function(err){
			if (err) throw err;

			var statement = con.query('SELECT * FROM `' + query[1] + '_' + query[0] + '`;', function(err, result){
				console.log('sql query: ' + statement.sql);
				console.log('result: ' + JSON.stringify(result));
				if (err) {
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "General SQL Error";
					callback(webpage_object);
					con.end();
					throw err
				};
				webpage_object.success_message.success = true;
				webpage_object.success_message.message = "";
				webpage_object.response_object = result;
					//replies to thread
				callback(webpage_object);
				con.end();
				return;
			});
		});
	}
}

exports.post_comments = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		let query = [];
		let comment_UUID = get_uuid();
		console.log('request object: ' + JSON.stringify(webpage_object.request_object))
		query.push(webpage_object.ip_address);
		query.push(webpage_object.request_object.thread_UUID);
		query.push(comment_UUID);
		query.push(webpage_object.request_object.comment);
		query.push(webpage_object.request_object.title);
		var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});



		con.connect(function(err){
			if (err) throw err;

			var statement = con.query('INSERT INTO `' + webpage_object.board + '_' + webpage_object.request_object.thread_UUID + '` (ip_address, thread_UUID, comment_UUID, post, title) VALUES ( ? , ? , ? , ? , ? );', query, function(err, result){
				console.log('sql query: ' + statement.sql);
				console.log('result: ' + JSON.stringify(result));
				if (err) {
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "Could not insert comment into thread";
					callback(webpage_object);
					con.end();
					throw err
				};

				con.query('UPDATE boards SET board_reply_count = board_reply_count + 1 WHERE shortname=?', [webpage_object.board], function(err, result){
					console.log('incrementing reply count for thread ' + webpage_object.request_object.thread_UUID + '...');
				});
					
				con.query('SELECT * FROM `' + webpage_object.board + '_' + webpage_object.request_object.thread_UUID + '`;',
					function(err, result){
						console.log('sql query: ' + statement.sql);
						console.log('comment inserted: ' + JSON.stringify(result));

						if (err) {
							webpage_object.success_message.success = false;
							webpage_object.success_message.message = "Could not retrieve comments on thread.";
							callback(webpage_object);
							con.end();
							throw err
						}

						webpage_object.success_message.success = true;
						webpage_object.success_message.message = "";
						webpage_object.response_object = result;

						callback(webpage_object);
						con.end();
					});
			});
		});
	}
}

exports.get_threads = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		let query = [];
		var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});
		query.push(webpage_object.board);
		con.connect(function(err){
			if (err) throw err;

			let statement = con.query("SELECT * FROM boards WHERE shortname = ?;", [webpage_object.board], function(err, result){
				console.log('query: ' + statement.sql);
				if (err) throw err;

				if(result.length == 0){
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "There are no boards by that name";
					callback(webpage_object);
					con.end();
					return;
				} else if(result.length == 1){
					con.query("SELECT * FROM board_" + webpage_object.board + ";", function(err, result){
						if (err) throw err;

						webpage_object.response_object.threads = result;

						webpage_object.success_message.success = true;
						webpage_object.success_message.message = "";

						callback(webpage_object);
						con.end();

					});
				} else {
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "Internal server error";
					callback(webpage_object);
					con.end();
					return;
				}
			});
		});
	} else {
		callback(webpage_object);
		return;
	}
}

exports.post_threads = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		let query = [];
		let thread_uuid = get_uuid();
		query.push(webpage_object.request_object.ip_address);
		query.push(thread_uuid);
		query.push(webpage_object.request_object.post);
		query.push(webpage_object.request_object.title)
		var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});



		con.connect(function(err){
			if (err) throw err;


			
			var statement = con.query('INSERT INTO board_' + webpage_object.board + '(ip_address, thread_UUID, post, title) VALUES ( ? , ? , ? , ? );', query, function(err, result){
				console.log('sql query: ' + statement.sql);
				if (err) {
					webpage_object.success_message.success = false;
					webpage_object.success_message.message = "General SQL Error";
					callback(webpage_object);
					con.end();
					throw err
				};
				webpage_object.success_message.success = true;
				webpage_object.success_message.message = "";

					//replies to thread
				if(webpage_object.success_message.success){
					con.query("CREATE TABLE `" + webpage_object.board + "_" + thread_uuid + "` (id INT NOT NULL AUTO_INCREMENT , ip_address varchar(20) NOT NULL , thread_UUID varchar(40) NOT NULL ,  comment_UUID varchar(40) NOT NULL, post text, title text, created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, PRIMARY KEY (id) );", 
						function(err, result){
							console.log('sql statement: ' + this.sql);
							if (err) {
								throw err;
							} else {
								console.log("created replies table: " + thread_uuid);
								webpage_object.success_message.success = true;
								webpage_object.success_message.message = "Successfully created thread";

								con.query('UPDATE boards SET board_post_count = board_post_count + 1 WHERE shortname=?', [webpage_object.board], function(err, result){
									console.log('incrementing threads count for board ' + webpage_object.board + '...');
								});

								con.query("SELECT * FROM board_" + webpage_object.board + " WHERE thread_UUID=?;",[thread_uuid], 
									function(err, result){
										console.log('sql statement: ' + this.sql);
										if(err){
											throw err;
										} else {
											webpage_object.response_object = result[0];
											console.log(JSON.stringify(webpage_object.response_object));
											callback(webpage_object);
											con.end();
											return;
										}
									});
							}
						});					
				}
			});
		});
	}
}

exports.get_boards = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){

		var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});
		con.connect(function(err){
			if (err) throw err;

			con.query("SELECT * FROM boards ORDER BY board_post_count LIMIT 15;", function(err, result){
				if (err) throw err;
				webpage_object.success_message.success = true;
				webpage_object.success_message.message = "";
				webpage_object.response_object = {boards: result};
				console.log('webpage_object before callback function: ' + JSON.stringify(webpage_object.response_object));
				callback(webpage_object);
				con.end();
				return;
			
			});
		});
	} else {
		console.log(webpage_object.success_message.message);
		callback(webpage_object);
		return;
	}
}

exports.create_board = function(webpage_object, callback){
	if(webpage_object.success_message.success == true){
		if(webpage_object.username != ""){
			var query = [];
			let username_query = [];

			var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
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
								con.end();
								return;
							} else {
								console.log("result: " + JSON.stringify(result));
								return;
							}						
						});
						if(webpage_object.success_message.success){

							con.query("create table board_" + query[2] + " (id INT NOT NULL AUTO_INCREMENT , ip_address varchar(20) NOT NULL , thread_UUID varchar(40) NOT NULL ,  post text, title text, created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) );",
								function(err, result){
									if (err) {
										console.log('sql statement: ' + this.sql);
										throw err;
									} else {
										console.log("created board: " + query[0]);
										webpage_object.success_message.success = true;
										webpage_object.success_message.message = "Successfully created board";
										callback(webpage_object);
										con.end();
										return;
									}
								});
						}
					} else {
						callback(webpage_object);
						con.end();
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
				host: "localhost",
				user: "root",
				password: "root",
				database: "node_imageboard",
			});
		con.connect(function(err){
			if (err) throw err;

			con.query("SELECT * FROM boards WHERE shortname = ?;", query, function(err, result){
				if (err) throw err;
				webpage_object.success_message.success = true;
				webpage_object.success_message.message = "";
				webpage_object.response_object = {boards: result};
				console.log('ping 1');
				callback(webpage_object);
				con.end();
				return;
			
			});
		});
	} else {
		callback(webpage_object);
		return;
	}
}

get_uuid = function(){
	return uuidv1();
}