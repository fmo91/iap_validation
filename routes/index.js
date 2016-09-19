var express = require('express');
var router = express.Router();
var iap = require('iap');

router.post('/validate_payment', function(req, res) {
	var paymentToken = req.body.token;
	var platform = req.body.platform;
	var productId = req.body.productId;
	var packageName = req.body.packageName;
	var keyObject = req.body.keyObject;

	if(!paymentToken) {
		res.status(400).send({
			"code": "BAD_REQUEST",
			"message": "Token is required"
		});
		return;
	}

	if(!platform) {
		res.status(400).send({
			"code": "BAD_REQUEST",
			"message": "platform is required"
		});
		return;	
	}

	if(platform !== 'apple' && platform !== 'google') {
		res.status(400).send({
			"code": "BAD_REQUEST",
			"message": "platform must be apple or google"
		});
		return;	
	}

	if(platform === 'google' && !keyObject) {
		res.status(400).send({
			"code": "BAD_REQUEST",
			"message": "If the platform is google, then the keyObject param is mandatory"
		});
		return;
	}

	if(!productId) {
		res.status(400).send({
			"code": "BAD_REQUEST",
			"message": "productId is required"
		});
		return;
	}

	if(!packageName) {
		res.status(400).send({
			"code": "BAD_REQUEST",
			"message": "packageName is required"
		});	
		return;
	}

	var payment = {};
	payment.productId = productId;
	payment.packageName = packageName;
	payment.receipt = paymentToken;
	payment.subscription = true;

	if(keyObject) {
		payment.keyObject = keyObject
	}

	iap.verifyPayment(platform, payment, function(error, response) {
		if(error) {
			console.log(error);

			res.status(500).send({
				"code": "SERVER_ERROR",
				"message": JSON.stringify(error)
			});
			return;
		}

		res.status(200).send(response);
	});
});


module.exports = router;
