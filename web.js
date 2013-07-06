var express = require('express');

var fs = require('fs');
var app = express.createServer(express.logger());

var file_bin = fs.readFileSync("/home/ubuntu/Github/bitstarter/web.js");

var bin_string = file_bin.toString();

app.get('/', function(request, response) {
  response.send(fs.readFileSync(bin_string));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
