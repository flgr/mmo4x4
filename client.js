var nick = prompt("Your nick name, please?");

var socket = io.connect('/');

    socket.on('connect', function (data) {
	socket.emit('join', { nick: nick });
	});