const express = require('express');
const router = express.Router();
const app = express();

const boards = require('./boards/boards');
const bans = require('./bans/bans');
const users = require('./users/users');

router.get('/api', function(request, response, next){
	response.send('this is my api endpoint');
});


module.exports = router;