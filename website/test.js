var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
const url = require('url');    
var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;

mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/node-demo");
app.use(bodyParser()); 

var nameSchema = new mongoose.Schema({
 firstName: String,
 phoneNumber: String
});
var User = mongoose.model("User", nameSchema);

//
app.get('/login', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('test.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

//
app.post('/login', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    var myData = new User(req.body);
 	myData.save()
 		.then(item => {
 		res.write();
 		res.status(200).redirect("submitted.html");
 	});
    
});

app.use(express.static(__dirname + '/'));



port = 8888;
app.listen(port);
console.log('Listening at http://localhost:' + port)
