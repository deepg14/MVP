var express = require('express');
var router = express.Router();

/* GET home page. */
// req  == request
// res == response

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
  //res.send("hello world");
});

module.exports = router;
