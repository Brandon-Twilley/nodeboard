const express = require('express');
const router = express.Router();
const app = express();

router.get('/boards/pools/comments', function(request, response, next){
	response.send('this is my pools comments endpoint');
}); 

module.exports = router;