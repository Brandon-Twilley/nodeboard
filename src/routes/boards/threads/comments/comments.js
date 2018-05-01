const express = require('express');
const router = express.Router();
const app = express();

router.get('/boards/threads/comments', function(request, response, next){
	response.send('this is my threads comments endpoint');
});
 
module.exports = router;