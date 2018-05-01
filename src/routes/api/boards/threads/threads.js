const express = require('express');
const router = express.Router();


router.get('/api/boards/threads', function(request, response, next){
	response.send('this is your threads api endpoint');
});

module.exports = router;