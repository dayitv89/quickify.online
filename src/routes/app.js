var express = require('express');
var router = express.Router();
var MobileDetect = require('mobile-detect');

/* GET to link store. */
router.get('/:link', function(req, res, next) {
	md = new MobileDetect(req.headers['user-agent']);
	switch (md.os()) {
		case 'iOS':
			res.redirect('https://itunes.apple.com/in/app/angry-birds/id343200656?mt=8');
			break;
		case 'AndroidOS':
			res.redirect('https://play.google.com/store/apps/details?id=com.rovio.angrybirds');
			break;
		default:
			res.setHeader('Content-type', 'application/json');
			res.send(JSON.stringify({ header: req.headers, os: md.os() }, null, 2));
	}
});

module.exports = router;
