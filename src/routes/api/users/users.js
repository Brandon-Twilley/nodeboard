const express = require('express');
const router = express.Router();


router.get('/api/users', function(request, response, next){
	response.send('this is your users api endpoint');
});

module.exports = router;