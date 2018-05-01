const express = require('express');
const router = express.Router();


router.get('/api/boards/threads/comments', function(request, response, next){
	response.send('this is your threads comments api endpoint');
});

module.exports = router;