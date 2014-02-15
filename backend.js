var util = require('util');

var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = 1537;
server.listen(port);
util.log(util.format("Server ready at http://localhost:%d/", port));


function Game(x,y) {
    this.name = "New Game";
    this.players = [];
    this.board = [];
    for (var i = 0; i < x; i++) {
        this.board[i] = []
        for (var j = 0; j < y; j++) {
            this.board[i][j] = '';
        }
    }   
}

Game.prototype.toString = function() {
    return this.name;
}

Game.prototype.put = function(x,y,player) {
    if (this.board[x][y].length) {
        throw "already taken";
    }
    else {
        this.board[x][y] = player;
    }
}
Game.prototype.finished = function() {
    // TODO determine whether one player has won
    return false;
}


function Server() {
    this.clients = {};
    this.name = 'New Game';
    this.games = [];
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

Server.prototype.pushGameUpdate = function(socket, changedGame) {
    socket.broadcast.emit("game update", this.games, changedGame);
};


Server.prototype.onNewGame = function(socket, data) {
    var game = new Game(data.x, data.y);
    if ("name" in data) 
        game.name = data.name;
    game.players.push(socket.client);
    this.games.push(game);
    console.info("games " + this.games.join(", "));
    console.info("Added game " + socket.client.nick + " (" + socket.id + ")" +
        ". Now have " + Object.keys(this.games).length);
    this.pushGameUpdate(socket, game);
    socket.emit("game update", this.games, game);
}

Server.prototype.onDeleteGame = function(socket) {
}

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

    socket.on('new-game', function(data) {
        server.onNewGame(socket, data);
    });

    socket.emit("connect");
});
