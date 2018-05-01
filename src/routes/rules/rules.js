const express = require('express');
const router = express.Router();

router.get('/rules', function(request, response) {
	response.render('rules/rules', {title: 'Rules'});
});

module.exports = router;