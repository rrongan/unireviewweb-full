var express = require('express');
var router = express.Router();

var sess;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.ejs',{ title: 'University Review Website' });
});

module.exports = router;
