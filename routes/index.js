var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:shortUrl', function (req, res) {
  res.redirect('http://www.imaginea.com');
});

module.exports = router;
