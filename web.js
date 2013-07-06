var express = require('express');

var app = express.createServer(express.logger());

var file_bin = fs.readFileSync("/home/bryan/bitstarter/bitstarter/web.js");

var bin_string = buf.toString(file_bin,0,file_bin.length);

app.get('/', function(request, response) {
  response.send(fs.readFileSync(bin_string));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
