const express = require('express');
const router = express.Router();
const app = express();

router.get('/users/login', function(request, response, next){
	response.render('login', {title: 'Login'});
});

module.exports = router;