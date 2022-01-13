
export default function () {

	var clients = [];

	return function(wsocket) {

		playerCount		= (playerCount + 1) % 26;
		var lastCommand		= "state";
		const playerId		= String.fromCharCode(65 + playerCount);
		const monitor		= Monitor(500, game, d => socket.write(d));
		const [run, remove]	= game.addPlayer(playerId);
		var buffer		= "";
		socket.on('data',	bufferize);
		socket.on('end',	close);
		socket.on('close',	close);
		socket.on('error',	close);

		clients.push(socket);
		socket.write(playerId + "\n");

		function close() {
			remove();
			monitor.kill();
			socket.destroy();
		}

		function flush() {
			for(var c of clients)
				if (c != socket)
					c.destroy();
			clients = [socket];
		}

		function bufferize(data) {
			var b = data.toString();
			if ( b[b.length - 1] == "\n" ) {
				handle((buffer + b).trim());
				buffer = "";
			} else buffer += b;
		}

		function handle(command, recurse = false) {

			Parser.alt([
				Parser.action(
					responses => responses.map(r => [r, Response.serialize(r, game)]).map(response => {
						var bye = 0;
						if (response[1].length) {
							bye = bye || response[0] == Bye;
							socket.write(response[1]);
							socket.write("\n");
						}
						if ( bye ) close();
						lastCommand = command;
					}),
					Parser.alt([
						Parser.action(monitor.run, monitor.parse),
						Parser.action(run, game.parse),
						Parser.action(() => [Bye], Parser.seq([Parser.string("exit"), Parser.end])),
					])
				),
				Parser.action(flush, Parser.seq([Parser.string("flush"), Parser.end])),
				Parser.action(() => handle(lastCommand, true), Parser.filter(() => !recurse, Parser.end)),
				Parser.action(() => socket.write(`<PROTOCOLERROR> bad command #${command}#\n`), Parser.true)
			])({pos: 0}, command);

		}

	};

}
