const express = require('express');
const router = express.Router();

router.get('/', function(request, response) {
	console.log('cookies: ', request.cookies);
	response.render('index', {title: 'index page'});
});

module.exports = router;