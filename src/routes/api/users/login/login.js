const express = require('express');
const router = express.Router();
const app = express();

router.get('/api/users/login', function(request, response, next){
	response.send('this is my api endpoint');
});


module.exports = router;