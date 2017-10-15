var express = require('express');
var bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var fs = require('fs');
var app = express();
const url = require('url');    
var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;
var NodeGeocoder = require('node-geocoder');

const mongourl = 'mongodb://localhost:27017/node-demo';
const accountSid = 'AC8940746a13337826746a006acd1998cd';
const authToken = '647002f3e302fd8cef8a000ed18baf97';

var options = {
  provider: 'google',

  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDIFQc6jdsvz5FDn42cZxy2GFH3C29Jwjk', // for Mapquest, OpenCage, Google Premier
  formatter: null 
};

app.get('/map', (request, response) => {
  fs.readFile("map.html", function(err, data){
    MongoClient.connect(mongourl, function(err, db) {
      if (err) throw err;
      db.collection("hungry").find({'finished': true}).toArray(function(err, result) {
        //console.log(result);
        response.writeHead(200, {'Content-Type': 'text/html'});
        datas = data.toString();
        dataspl = datas.split("/**TESTING**/");
        //console.log(dataspl[1]);

        results = "[";
        for(var i = 0; i < result.length; i++){
          results += "{'long':" + result[i].long + ",'lat':" + result[i].lat + ",'vitality':" + result[i].vitality + ",'num': '" + (result[i]._id) + "'}";
          if(i != result.length -1){
            results += ",";
          }
        }
        results += "]";
        console.log(results);
        data_t = dataspl[0] + "var locs = " + results + ";" + dataspl[1];
        //console.log(result);
        //console.log(data_t);
        response.write(data_t);
        response.end();
        db.close();
      });
    });
  });
});

MongoClient.connect(mongourl, function(err, db) {
    if (err) throw err;
    db.createCollection('hungry', function(err, collection) {});
    console.log("Connected correctly to MongoDB Server");
});

app.post('/sms', (req, res) => {
    const mongourl = 'mongodb://localhost:27017/node-demo';
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
                function multiresponse(a, b){
                    twiml.message().body(a);
                    twiml.message().media(b);
                    //twiml.message().media = 'https://farm8.staticflickr.com/7090/6941316406_80b4d6d50e_z_d.jpg';
                    console.log("Sending Image: " + b);
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
                        const imgadd = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + json.results[0].geometry.location.lat + ',' + json.results[0].geometry.location.lng + '&heading=151.78&pitch=-0.76&key=AIzaSyAGlEleGphQnEpoSGOds8owoeltH89-55E'
                        multiresponse("Does this look like the correct address: " + json.results[0].formatted_address + "?", imgadd);
                    });
                }else if(current_person.step == 3){
                    if(inc == 'No'){
                        response("Okay, can you try to respecify your location?");
                        current_person.step = 2;
                        update(current_person);
                    } else {
                        response("How hungry are you from 1 to 3?");
                        current_person.step = 4;
                        update(current_person);
                    }
                }else if(current_person.step == 4){
                    response("Great! We got your info, we'll update you when we find a donor!");
                    if(inc == '1'){
                        current_person.vitality = 1;
                    } else if(inc == '2'){
                        current_person.vitality = 2;
                    } else if(inc == '3'){
                        current_person.vitality = 3;
                    } else {
                        current_person.vitality = 1;
                    }
                    current_person.step = 0;
                    current_person.finished = true;
                    update(current_person);
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

app.post('/found', (req, res) => {
    const mongourl = 'mongodb://localhost:27017/node-demo';
    //console.log(req);
    var inc = req.body.num;
    const client = require('twilio')(accountSid, authToken);
    console.log(inc);
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
                db.collection("hungry").updateOne({'_id': inc}, current_person, function(err, result) {
                    if (err) throw err;
                    db.close();
                });
        });
    });
});

mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/node-demo");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var nameSchema = new mongoose.Schema({
 firstName: String,
 phoneNumber: String
});
var User = mongoose.model("User", nameSchema);

//
app.get('/feeder', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

//Submission for feeder form
app.post('/feeder', function(req, res){
    console.log('POST FOR FEEDER /');
    console.dir(req.body);
    var myData = new User(req.body);
    console.log("LOG OF REQ");
    console.log(req.body);
    var parsedData = filterLocation(req.body);
    //makeJSON(parsedData);
 	myData.save()
 		.then(item => {
 		console.log("Submitted data to Mongo success");
 		res.status(200).redirect("/map");
 	});
    
});

function filterLocation(data){
    var location = data['feeder_location'];
    var geocoder = NodeGeocoder(options);
    geocoder.geocode(location)
      .then(function(res) {
        data['lat'] = res[0]['latitude'];
        data['lng'] = res[0]['longitude'];
        var obj = {
       table: []
    };
    obj.table.push(data);
    var json = JSON.stringify(obj);

    fs.writeFile ("input.json", "inputData = ", function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
    console.log(json);
    fs.appendFile('input.json', JSON.stringify(obj), function (err) {
    if (err) throw err;
  console.log('Saved!');
    });
    
    
    })
      .catch(function(err) {
        console.log(err);
      });

}

app.get('/hungry', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

//Submission for hungry form
app.post('/hungry', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    var myData = new User(req.body);
 	myData.save()
 		.then(item => {
 		console.log("Submitted data to Mongo success");
 		res.status(200).redirect("submitted.html");
 	});
    
});

app.use(express.static(__dirname + '/'));



port = 1185;
//port = 1337;
app.listen(port);
console.log('Listening at http://localhost:' + port)
