var util = require('util');

var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = 1537;
server.listen(port);
util.log(util.format("Server ready at http://localhost:%d/", port))

var clients = {};

io.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
    	socket.client = { nick: data.nick };
    	socket.emit('welcome', {});

    	clients[data.nick] = socket.client;
        console.info("Adding client " + socket.client.nick + " (" + socket.id + ")" + ". Now have " + Object.keys(clients).length);
        console.info(clients);
    });

    socket.on('disconnect', function() {
    	if ("client" in socket) {
	    	delete clients[socket.client.nick];
	    }
    });
});
