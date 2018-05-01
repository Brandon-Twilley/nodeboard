const express = require('express');
const router = express.Router();
const app = express();

router.get('/users/login/signup', function(request, response, next){
	response.render('signup', {title: 'Signup'});
});

module.exports = router;