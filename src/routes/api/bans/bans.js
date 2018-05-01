const express = require('express');
const router = express.Router();


router.get('/api/bans', function(request, response, next){
	response.send('this is your bans api endpoint');
});

module.exports = router;