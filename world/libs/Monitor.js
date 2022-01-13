import Parser from "./Parser.js";

export default function(game, write, timeout = 500, cols = 13, update = true, running = false, current = 0, comments = false) {

	var cancel;
	if ( running ) start();
	return {start, stop, refresh, parse, run};

	function loop(index) {
		if (running && current == index) {
			refresh(running);
			cancel = setTimeout(() => loop(index), timeout);
		}
	}

	function start(mode) {
		if ( !running ) {
			update = true;
			refresh(mode, true);
			cancel = setTimeout(() => loop(++current), 0);
		}
		running = mode;
	}

	function stop() {
		clearTimeout(cancel);
		running = false;
	}

	function refresh(mode, force) {
		if (force || update) {
			//~ update = false;
			switch(mode) {
				case "map":
					var b = "";
					game.space.write(s => b += s, comments);
					game.writeStatus(s => b += s);
					return write(b);
				case "players":
					var b = "";
					game.writePlayers(s => b += s, cols);
					game.writeStatus(s => b += s);
					return write(b);
			}
		}
	}

	function run(match) {
		switch(match[1]) {
			case "": refresh(match[0], true); break;
			case " off": stop(); break;
			case " on": start(match[0] != "monitor" ? match[0] : "map"); break;
			case " -": timeout += 75; break;
			case " +": timeout = Math.max(0, timeout - 75); break;
			case " #": comments = !comments; if (comments); refresh(running, true); break;
			default: match[1][0] == ' ' ? timeout = match[1][1] : cols = match[1][1];
		}
		write(`MONITOR ${running || "OFF"} ${comments ? "#" : ""} : (timeout: ${timeout}ms, cols: ${cols})\n`);
	}

	function parse(state, str) {
		return Parser.seq([
			Parser.alt([
				Parser.string("monitor"),
				Parser.string("map"),
				Parser.string("players"),
			]),
			Parser.alt([
				Parser.seq([Parser.string(" cols "), Parser.nat]),
				Parser.seq([Parser.string(' '), Parser.nat]),
				Parser.string(" #"),
				Parser.string(" +"),
				Parser.string(" -"),
				Parser.string(" off"),
				Parser.string(" on"),
				Parser.string(""),
			]),
			Parser.end,
		])(state, str);
	}

}
