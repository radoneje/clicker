var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.webSocket);
  res.json("ok")
});

router.get('/next/:id', function(req, res, next) {
  req.webSocket.next(req.params.id)
  res.json("ok")
});

router.get('/pre/:id', function(req, res, next) {

  req.webSocket.pre(req.params.id)
  res.json("ok")
});

module.exports = router;
