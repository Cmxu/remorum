var MongoClient = require('mongodb').MongoClient;
const mongourl = 'mongodb://localhost:27017/node-demo';
var fs = require("fs");
console.log("\n *START* \n");
var content = fs.readFileSync("homeless.json");
var test = JSON.parse(content);
//console.log(test.data[0]);
MongoClient.connect(mongourl, function(err, db) {
    if (err) throw err;
	for(var i = 0; i < 5; i++){
		var new_hungry = {'_id': 'homeless' + i, finished:true, step:0, long:test.data[i][14], lat:test.data[i][13], vitality:-1}
		db.collection("hungry").insertOne(new_hungry, function(err, res) {
            if (err) throw err;
        });
	}
	db.close();
});
console.log("\n *EXIT* \n");