$(window).load(function() {
	console.info("Window load called");
	var socket = io.connect('/');

	var nickField = $('#nickName');
	nickField.focus();

	$('[data-js="start-new-game"]').on('click', function(e) {
		socket.emit('new-game', { x: 5, y: 3 });
	});

	$('[data-js="join"]').on('click', function(e) {
		e.preventDefault();
		var nick = nickField.val();
		socket.emit('join', { nick: nick });
		// hide welcome element
		$('.welcome').hide();
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

		/*socket.on('game update', function(games, changedGame) {
			console.info('game update', changedGame);
			var gamesDiv = $('#games');

			gamesDiv.empty();

			games.forEach(function(game) {
				gamesDiv.append("<li class='game'><span class='glyphicon glyphicon-send'> </span> " + game.name + "</li>");
			})
		});*/

        socket.on('game update', function(game) {
            console.log('game update', game);

            $('.board').empty();

            for (var y = 0; y < game.height; y++) {
                for (var x = 0; x < game.width; x++) {
                    var classes = ['cell__block', 'cell'];

                    if ((x+y%2) % 2 == 0) { classes.push('cell--marked'); }

                    var tileMark = (game.board[x + "-" + y] || {}).nick;

                    console.log(x, y, tileMark);

                    $('<article/>', { class: classes.join(" "), text: tileMark }).appendTo('.board');
                }

                $('<br/>', {}).appendTo('.board');
           }
        });
	});
});
