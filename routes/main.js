var express = require('express');
var router = express.Router();

/* GET main page. */
router.main = function(req, res, next) {
    sess = req.session;
    if(sess.username) {
        res.write('<h1>Hello '+sess.username+'</h1>');
        res.end('<a href="/logout">Logout</a>');
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/login">Login</a>');
    }
};

module.exports = router;
