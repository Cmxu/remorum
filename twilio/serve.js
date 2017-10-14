const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser());

app.post('/sms', (req, res) => {
	const twiml = new MessagingResponse();
	var inc = req.body.Body;
	function response(a){
		twiml.message(a);
		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
	}
	switch(inc){
		case 'test':
			response('test yourself');
			break;
		case 'I\'m hungry':
			response('Okay, let me see how I can help. Where are you?');
			break;
		default:
			//twiml.message('Not sure how to respond to that');
			let req = require('request');
			inc = inc.replace(new RegExp(" "), "+");
			req('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + inc + '&key=AIzaSyDwRg-graUKatskNPM7UACV-oj_tqPVOMo', (err, res, body) => {
				let json = JSON.parse(body);
				response(json.results[0].formatted_address);
			});
	}
});

http.createServer(app).listen(1337, () => {
	console.log('Express server listening on port 1337');
});
