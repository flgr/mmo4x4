var util = require('util');

var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = 1537;
server.listen(port);
util.log(util.format("Server ready at http://localhost:%d/", port))

function Server() {
    this.clients = {};
}

Server.prototype.pushClientUpdate = function(socket, changedClientNick) {
    socket.broadcast.emit("client update", this.clients, changedClientNick);
};

Server.prototype.onClientJoin = function(socket, data) {
    this.clients[data.nick] = socket.client = { nick: data.nick };
    console.info("Added client " + socket.client.nick + " (" + socket.id + ")" +
        ". Now have " + Object.keys(this.clients).length);
    this.pushClientUpdate(socket, socket.client.nick);
    socket.emit("client update", this.clients, null);
};

Server.prototype.onClientDisconnect = function(socket) {
    delete this.clients[socket.client.nick];
    console.info("Removed client " + socket.client.nick + " (" + socket.id + ")" +
        ". Now have " + Object.keys(this.clients).length);    
    this.pushClientUpdate(socket, socket.client.nick);
};

var server = new Server();

io.sockets.on('connection', function(socket) {
    socket.on('join', function(data) {
        server.onClientJoin(socket, data);
    });

    socket.on('disconnect', function() {
    	if ("client" in socket) {
            server.onClientDisconnect(socket);
	    }
    });

    socket.emit("connect");
});
