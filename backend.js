var util = require('util');

var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = 1537;
server.listen(port);
util.log(util.format("Server ready at http://localhost:%d/", port))
