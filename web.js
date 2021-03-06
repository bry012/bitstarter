var express = require('express');

var fs = require('fs');
var app = express.createServer(express.logger());

var file_bin = fs.readFileSync("index.html");

var bin_string = file_bin.toString();
console.log(bin_string);
app.get('/', function(request, response) {
  response.send(bin_string);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
