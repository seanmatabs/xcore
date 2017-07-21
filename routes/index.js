var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GamersHub'});
});

router.get('/nathan/', function(req, res, next) {
    res.render('index', { title: 'hello'});
});

module.exports = router;
