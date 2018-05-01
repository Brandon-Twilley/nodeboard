const express = require('express');
const router = express.Router();
const app = express();

router.get('/boards/threads', function(request, response, next){
	response.send('this is my board threads endpoint');
}); 

module.exports = router;