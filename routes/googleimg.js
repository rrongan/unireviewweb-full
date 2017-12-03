var express = require('express');
var google_image = require('g-i-s');
var router = express.Router();

router.imagesearch = function (req, res) {
	google_image(req.params.keyword,logResults);
	function logResults(error, results) {
		if (error) {
			res.status(404).json({ message: 'Image Search Error!', errmsg : error } );
		}
		else {
			res.json(results);
		}
	}
};

module.exports = router;