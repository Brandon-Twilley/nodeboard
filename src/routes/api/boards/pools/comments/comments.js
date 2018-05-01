const express = require('express');
const router = express.Router();


router.get('/api/boards/pools/comments', function(request, response, next){
	response.send('this is your pools comments api endpoint');
});

module.exports = router;