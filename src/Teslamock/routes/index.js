var express = require('express');
var router = express.Router();
import './fonts/Dolphins.ttf'
import './fonts/Dolphins.woff'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TeslaMock', cars: 1 });
});

module.exports = router;
