var express = require('express');
var auth = require('../routes/authentication')
var router = express.Router();

var sess;
/* GET home page. */
router.get('/',auth.sessionChecker, function(req, res, next) {
    res.render('index.ejs',{ title: 'University Review Website' });
});

module.exports = router;
