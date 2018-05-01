const express = require('express');
const router = express.Router();


router.get('/', function(request, response, next){
	response.send('this is your users endpoint');
});

module.exports = router;