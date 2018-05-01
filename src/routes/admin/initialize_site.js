const express = require('express');
const router = express.Router();
const app = express();

router.get('/admin', function(request, response, next){
	response.send('this is my board view');
}); 

router.get('/admin/setup', function(request, response, next){
	response.send('this is my setup view');
});

module.exports = router;