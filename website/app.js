var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
const url = require('url');    
var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
};

mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/node-demo");
app.use(bodyParser()); 

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
    console.log('POST /');
    console.dir(req.body);
    var myData = new User(req.body);
    var parsedData = filterLocation(req.body);
    console.log(parsedData);
    //makeJSON(parsedData);
 	myData.save()
 		.then(item => {
 		console.log("Submitted data to Mongo success");
 		res.status(200).redirect("map.html");
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
    fs.writeFile ("input.json", JSON.stringify(obj), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
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
app.listen(port);
console.log('Listening at http://localhost:' + port)
