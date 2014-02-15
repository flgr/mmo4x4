var nick = prompt("Your nick name, please?");

$(window).load(function() {
	var socket = io.connect('/');

	socket.on('connection', function (data) {
		socket.on('client update', function(clients, changedClient) {
			console.info('client update', clients);
			var sortedNicks = Object.keys(clients).sort();
			$('#players').text(sortedNicks.join(", "));
		});

		socket.emit('join', { nick: nick });
	});
});
