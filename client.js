var nick = prompt("Your nick name, please?");

$(window).load(function() {
	console.info("Window load called");
	var socket = io.connect('/');

	socket.on('connect', function (data) {
		console.info("Socket connected");

		socket.on('client update', function(clients, changedClient) {
			console.info('client update', clients);
			var sortedNicks = Object.keys(clients).sort();
			$('#players').empty();

			for (var i = 0; i < sortedNicks.length; i++) {
				var sortedNick = sortedNicks[i];
				$('<li/>', { class: 'player', text: sortedNick }).appendTo('#players');
			}
		});

		socket.emit('join', { nick: nick });
	});
});
