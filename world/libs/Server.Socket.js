import net			from "net";
import {TimeLoop as Loop}	from "./Loop.js";
import Monitor			from "./Monitor.js";
import Parser			from "./Parser.js";

const defaultConf = {
};

var logger = (...a) => console.log(...a);
//~ var logger = () => {};

export default function (game, conf) {

	var clients	= [];
	var clientsId	= {};
	var playerSym	= 11208;
	var loop	= Loop(game, 1000);
	var server	= net.createServer(onConnection);
	server.on('listening', onStart);
	return server.listen(conf.port, conf.host);

	function onStart() {
		loop.start();
		logger(new Date, `server listening on ${conf.host}:${conf.port}`)
	}

	function onConnection(socket) {

		var lastCommand		= "state";
		const playerId		= String.fromCharCode(playerSym++);
		const monitor		= Monitor(game, d => socket.write(d));
		const player		= game.addPlayer(playerId, 10000, 10000);
		var buffer		= "";
		var cleaned		= false;
		var timestamp		= 1;
		clients.push(socket);
		clientsId[playerId] = socket;

		socket.on('end', clean);
		socket.on('close', clean);
		socket.on('error', clean);
		socket.on('data', function (data) {
			buffer += data.toString();
			if ( buffer[buffer.length - 1] != "\n" )
				return;

			buffer = buffer.trim();
			logger(new Date, `from player ${playerId}: "${buffer}"`);
			handle(buffer);
			buffer = "";
		});

		logger(new Date, `new player ${playerId}`);
		socket.write(`welcome player ${playerId}\n`);

		function writer(s) {
			console.log(new Date, `sending player ${playerId} : ${s}`);
			socket.write(s);
		}

		function stop() {
			logger(new Date, `stop server from player ${playerId}`);
			flush();
			clean();
			loop.stop();
			server.close();
		}

		function clean() {
			if (cleaned) return;
			cleaned = true;
			logger(new Date, `player quit ${playerId}`);
			game.removePlayer(player);
			monitor.stop();
			const idx = clients.indexOf(socket);
			if (idx != -1) clients.splice(idx, 1);
			delete clientsId[playerId];
			socket.destroy();
		}

		function kill(killCmd) {
			for(var [_, playerId] of killCmd[1])
				if (clientsId[playerId]) {
					clientsId[playerId].write(`You have been killed by ${player.id}\n`);
					clientsId[playerId].end();
					clientsId[playerId].destroy();
					socket.write(`Player ${playerId} has been killed.\n`);
				}
			return () => {};
		}

		function flush() {
			logger(new Date, `flush players from ${playerId}`);
			for(var c of clients)
				if (c != socket) {
					c.end();
					c.destroy();
				}
			clients = [socket];
			clientsId = {playerId: socket};
		}

		function last() {
			logger(new Date, `player ${playerId} last command was "${lastCommand}"`);
			handle(lastCommand, true);
		}

		function cls() {
			logger(new Date, "player", playerId, "clear screen");
			socket.write((new Array(150)).join("\n"));
		}

		function handle(command, recurse = false) {

			const r = Parser.action(handler => handler[0](), Parser.seq([
				Parser.alt([
					Parser.action(a => () => loop.onAction(player, a, writer), game.parse),
					Parser.action(m => () => monitor.run(m), monitor.parse),
					Parser.value(last, Parser.filter(() => !recurse, Parser.end)),
					Parser.value(loop.stop, Parser.string("loop stop")),
					Parser.value(loop.start, Parser.string("loop start")),
					Parser.value(() => writer("loop timeout " + loop.speedUp() + " ms\n"), Parser.string("loop +")),
					Parser.value(() => writer("loop timeout " + loop.speedDown() + " ms\n"), Parser.string("loop -")),
					Parser.value(clean, Parser.string("exit")),
					Parser.value(stop, Parser.string("stop")),
					Parser.value(flush, Parser.string("flush")),
					Parser.value(cls, Parser.string("cls")),
					Parser.action(kill, Parser.seq([
						Parser.string("kill"),
						Parser.more(Parser.seq([
							Parser.space,
							Parser.regex(/^[^ ]/),
						])),
						Parser.end
					])),
				]),
				Parser.end
			]))({pos: 0}, command);

			if (r && command)
				lastCommand = command;

			if (!r) {
				logger(new Date, `to player ${playerId}: "protocol bad command ${command}"`);
				socket.write(`invalid command ${command}\n`);
			}

		}

	}

}
