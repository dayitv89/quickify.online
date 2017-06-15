var express = require('express');
var router = express.Router();
var qr = require('qr-image');

var QRCode = require('qrcode');
var Promise = require('promise');
var crypto = require('crypto');

/* Generate QRs+helper */
const hash = function(t) {
	return crypto.createHash('md5').update(t + 'salt1231267318236182gsdfssdf').digest('hex');
};

const createQR = function(qr) {
	const options = {
		margin: 1,
		scale: 10,
		errorCorrectionLevel: 'H',
		type: 'image/png',
		color: {
			dark: '#3b5998', // Blue dots
			light: '#fff9' // Transparent background
		}
	};

	const filename = hash(qr) + '.png';
	return new Promise(function(resolve, reject) {
		QRCode.toFile('./src/public/images/qr/' + filename, qr, options, function(err, url) {
			if (err) {
				reject(err);
			} else {
				resolve(filename);
			}
			console.log('done: ' + qr);
		});
	});
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Deep link testing', qr_value: '' });
});

router.get('/:text', function(req, res, next) {
	const link = 'http://' + req.headers.host + '/a/' + req.params.text;
	createQR(link)
		.then(filename => {
			res.render('index', {
				title: 'quickify.online',
				qr_value: filename
			});
		})
		.catch(err => {
			throw err;
		});
});

router.get('/qr/:text', function(req, res) {
	var code = qr.image(req.params.text, { type: 'png', ec_level: 'H', size: 10, margin: 0 });
	res.setHeader('Content-type', 'image/png');
	code.pipe(res);
});

module.exports = router;
