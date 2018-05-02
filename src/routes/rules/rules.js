const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/rules', function(request, response) {
	var obj;
	fs.readFile('./src/json_data/rules.json', 'utf8', function(err, data){
		if (err) throw err;
		//response.send(data);
		obj = JSON.parse(data);
		//response.send(JSON.stringify(obj));
		response.render('rules/rules', obj);
	});
});

module.exports = router;