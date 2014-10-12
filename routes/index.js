var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Hook & Loop Meeting Booker' });
});

module.exports = router;