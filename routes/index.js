var express = require('express');
var router = express.Router();

var sess;
/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    console.log(sess.username);
    if(sess.username) {
        res.redirect('/main');
    }
    else {
        res.render('index.ejs',{ title: 'University Review Website' });
    }
});

module.exports = router;
