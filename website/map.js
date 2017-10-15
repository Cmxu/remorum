const MongoClient = require('mongodb').MongoClient
const mongourl = 'mongodb://localhost:27017/demo';

const http = require('http');
const fs = require("fs");
 
http.createServer(function(request, response) {
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
          results += "{'long':" + result[i].long + ",'lat':" + result[i].lat + ",'vitality':" + result[i].vitality + ",'num':" + result[i]._id + "}";
          if(i != result.length -1){
            results += ",";
          }
        }
        results += "]";
        //console.log(results);
        data_t = dataspl[0] + "var locs = " + results + ";" + dataspl[1];
        //console.log(result);
        //console.log(data_t);
        response.write(data_t);
        response.end();
        db.close();
      });
    });
  });
}).listen(3000);
console.log('Listening at http://localhost:' + 3000);
