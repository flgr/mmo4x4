var nick = prompt("Your nick name, please?");

$(window).load(function() {
	console.info("Window load called");
	var socket = io.connect('/');

	socket.on('connect', function (data) {
		console.info("Socket connected");

		socket.on('client update', function(clients, changedClient) {
			console.info('client update', clients);
			var sortedNicks = Object.keys(clients).sort();
			$('#players').text(sortedNicks.join(", "));
		});

		socket.emit('join', { nick: nick });
	});
});
