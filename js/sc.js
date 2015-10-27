var currentPlayer;

SC.initialize({
	client_id: '4be5f67fb3f99bbf86796c7a713b124b'
});

SC.stream('/tracks/173324934').then(function(player) {
	currentPlayer = player;
	player.play();
}).catch(function () {
	console.log(arguments);
});

document.getElementById('pause').addEventListener('click', function() {
	if (currentPlayer) {
		currentPlayer.pause();
	}
});

document.getElementById('play').addEventListener('click', function() {
	if (currentPlayer) {
		currentPlayer.play();
	}
});
