const express = require('express');
const router = express.Router();


router.get('/api/boards/pools', function(request, response, next){
	response.send('this is your pools api endpoint');
});

module.exports = router;