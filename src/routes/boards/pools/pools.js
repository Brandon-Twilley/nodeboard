const express = require('express');
const router = express.Router();
const app = express();

router.get('/boards/pools', function(request, response, next){
	response.send('this is my board pools endpoint');
});
 

module.exports = router;