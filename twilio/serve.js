const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

const mongourl = 'mongodb://localhost:27017/demo';
const app = express();

MongoClient.connect(mongourl, function(err, db) {
	if (err) throw err;
	db.createCollection('hungry', function(err, collection) {});
	console.log("Connected correctly to MongoDB Server");
});
app.use(bodyParser());

app.post('/sms', (req, res) => {
	const mongourl = 'mongodb://localhost:27017/demo';
	const twiml = new MessagingResponse();
	var inc = req.body.Body;
	var num = req.body.From;
	MongoClient.connect(mongourl, function(err, db) {
		if (err) throw err;
		function main_function(){
			db.collection("hungry").find({'_id': num}).toArray(function(err, result) {
				if (err) throw err;
				current_person = result[0];
				function response(a){
					twiml.message(a);
					res.writeHead(200, {'Content-Type': 'text/xml'});
					res.end(twiml.toString());
				}
				function update(updated){
					db.collection("hungry").updateOne({'_id': num}, updated, function(err, result) {
						if (err) throw err;
						db.close();
					});
				}
				
				if(current_person.step == 0){
					response('Hi! Are you hungry?');
					current_person.step = 1;
					update(current_person);
				}else if(current_person.step == 1){
					response('Okay, let me see how I can help. Where are you?');
					current_person.step = 2;
					update(current_person);
				}else if(current_person.step == 2){
					//twiml.message('Not sure how to respond to that');
					let req = require('request');
					inc = inc.replace(new RegExp(" "), "+") + "+New+York";
					req('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + inc + '&key=AIzaSyDwRg-graUKatskNPM7UACV-oj_tqPVOMo', (err, res, body) => {
						let json = JSON.parse(body);
						current_person.long = json.results[0].geometry.location.lng;
						current_person.step = 3;
						current_person.lat = json.results[0].geometry.location.lat;
						update(current_person);
						response("Does this look like the correct address: " + json.results[0].formatted_address + "?");
					});
				}else if(current_person.step == 3){
					if(inc == 'No'){
						response("Okay, can you try to respecify your location?");
						current_person.step = 2;
						update(current_person);
					} else {
						response("Great! We got your info, we'll update you when we find a donor!");
						current_person.step = 0;
						current_person.finished = true;
						update(current_person);
					}
				}else {
					response("Something bad happened");				
				}
			});
		}
		db.collection("hungry").find({'_id': num}).toArray(function(err, result) {
			if (err) throw err;
			if(result.length == 0){
				var new_hungry = {_id: num, finished:false, step:0, long:0, lat:0, vitality:0}
				db.collection("hungry").insertOne(new_hungry, function(err, res) {
					if (err) throw err;
					main_function();
				});
			} else {
				main_function();
			}
		});
	});
});

http.createServer(app).listen(1337, () => {
	console.log('Express server listening on port 1337');
});
