const express = require('express');
const router = express.Router();
const app = express();
const pools = require('./pools/pools');
const threads = require('./threads/threads');

router.get('/api/boards', function(request, response, next){
	response.send('this is your boards api endpoint');
});


module.exports = router;