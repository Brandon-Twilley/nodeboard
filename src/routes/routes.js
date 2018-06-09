const express = require('express');
const router = express.Router();
const app = express();

//REST API endpoints
const bans_api = require('./api/bans/bans');
const boards_api = require('./api/boards/boards');
const pools_api = require('./api/boards/pools/pools');
const pools_comments_api = require('./api/boards/pools/comments/comments');
const threads_api = require('./api/boards/threads/threads');
const login_api = require('./api/users/login/login');

//webpage endpoints
const bans = require('./bans/bans');
const boards = require('./boards/boards');
const add_board = require('./boards/add');
const pools = require('./boards/pools/pools');
const pools_comments = require('./boards/pools/comments/comments');
const threads = require('./boards/threads/threads');
const threads_comments = require('./boards/threads/comments/comments');
const users = require('./users/users');
const login = require('./users/login/login');
const signup = require('./users/login/signup');
const admin = require('./admin/initialize_site.js');
const rules = require('./rules/rules');


router.get('/', function(request, response, next){
	response.render('index', { title: 'Express imageboard' });
	console.log('cookies: ', request.cookies);
});

//api endpoints
router.use(bans_api);
router.use(boards_api);
router.use(pools_api);
router.use(pools_comments_api);
router.use(threads_api);
router.use(login_api);

//webpage endpoints
router.use(bans);
router.use(boards);
router.use(pools);
router.use(pools_comments);
router.use(threads);
router.use(threads_comments);
router.use(users);
router.use(login);
router.use(signup);
router.use(rules);


module.exports = router;
