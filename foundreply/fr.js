const accountSid = 'AC8940746a13337826746a006acd1998cd';
const authToken = '647002f3e302fd8cef8a000ed18baf97';
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

const mongourl = 'mongodb://localhost:27017/demo';
const app = express();

app.post('/found', (req, res) => {
	const mongourl = 'mongodb://localhost:27017/demo';
	var inc = req.num;
	const client = require('twilio')(accountSid, authToken);

	client.messages
	  .create({
	    to: inc,
	    from: '+13122486437',
	    body: 'Testing123',
	  })
	  .then((message) => console.log(message.sid));
	MongoClient.connect(mongourl, function(err, db) {
		if (err) throw err;
		db.collection("hungry").find({'_id': inc}).toArray(function(err, result) {
				if (err) throw err;
				current_person = result[0];
				current_person.finished = false;
				db.collection("hungry").updateOne({'_id': num}, current_person, function(err, result) {
					if (err) throw err;
					db.close();
				});
		});
	});
});

http.createServer(app).listen(1338, () => {
	console.log('Express server listening on port 1338');
});
