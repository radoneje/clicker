var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', workerId:1 });
});
router.get('/worker/:id', function(req, res, next) {
  res.render('index', { title: 'Express' , workerId:req.params.id});
});

module.exports = router;
