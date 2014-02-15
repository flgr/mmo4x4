var nick = prompt("Your nick name, please?");

$(window).load(function() {
	console.info("Window load called");
	var socket = io.connect('/');

	$('[data-js="start-new-game"]').on('click', function(e) {
		socket.emit('new-game', { x: 5, y: 3 });
	});

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

		socket.on('game update', function(games, changedGame) {
			console.info('game update', changedGame);
			var gamesDiv = $('#games');

			gamesDiv.empty();

			games.forEach(function(game) {
				gamesDiv.append("<li class='game'><span class='glyphicon glyphicon-send'> </span> " + game.name + "</li>");
			})
		});

		socket.emit('join', { nick: nick });
	});
});
