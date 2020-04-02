var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var execSync = require('child_process').execSync;
var app = express();
var port = 8002;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Hub-Signature");
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function verifyPostData(req, res, next) {
	const payload = JSON.stringify(req.body);
	if (!payload) {
		return next('Request body empty');
	}

	const sig = req.get('X-Hub-Signature') || '';
	const hmac = crypto.createHmac('sha1', process.env.WEBHOOK_SECURE_PHRASE);
	const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
	const checksum = Buffer.from(sig, 'utf8');
	if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
		return next(`Request body digest did not match X-Hub-Signature.`);
	}
	return next();
}

app.post('/', verifyPostData, (req, res) => {
	console.log(`début de la mise à jour du projet ${req.body.repository.name}...`);
	require(`./scripts/${req.body.repository.name}`)();
	console.log(`projet ${req.body.repository.name} mis à jour.`);
	res.end('done');
});

app.listen(port);
console.log('Webhooks manager started on: ' + port);