const express = require('express');
const router = express.Router();
const app = express();

router.get('/boards', function(request, response, next){
	response.send('this is my board view');
}); 

router.get('/boards/view/', function(request, response, next){
	response.render('boards/view', {title: 'boards'});
	//response.send('this is where i view my boards');
})

router.get('/boards/add', function(request, response, next){
	response.render('boards/add', {title: 'add board'});
	//response.send('this is where i add a board');
})

module.exports = router;