import Response from "../Response.js";



function trigger(game, list) {
	return new Promise(function (r,j) {
		setTimeout(function () {
			for(var [player, responses, writer] of game.refresh(list))
				for(var re of responses)
					writer(Response.serialize(re, game, player, game.space.playerCell(player.id)) + "\n");
			r();
		}, 0);
	});
}

export function TimeLoop(game, timeout = 500, running = false, currentLoop = 0, cancel = null, actions = {}) {

	if ( running )
		loop(currentLoop);
	return {start, stop, speedUp, speedDown, onAction, clearAction, game};

	function onAction(player, action, writer) {
		actions[player.id] = {action, writer};
	}

	function speedUp() {
		timeout -= 25;
		return timeout;
	}

	function speedDown() {
		timeout += 25;
		return timeout;
	}

	function clearAction(player) {
		delete actions[player.id];
	}

	function start() {
		if ( !running ) {
			running = true;
			loop(currentLoop++);
		}
	}

	function loop(index) {
		if (running) {
			var process = trigger(game, Object.entries(actions));
			actions = {};
			process.then(_ => setTimeout(() => loop(index), timeout));
		}
	}

	function stop() {
		clearTimeout(cancel);
		running = false;
	}

}

export function PlayerLoop(game, running = false, actions = {}) {

	return {start, stop, onAction, clearAction, game};

	function onAction(player, action, writer) {
		actions[player.id] = {action, writer};
		if (running && Object.values(actions).length == game.space.getPlayers().length) {
			trigger(game, Object.entries(actions));
			actions = {};
		}
	}

	function clearAction(player) {
		delete actions[player.id];
	}

	function start() {
		running = true;
	}

	function stop() {
		running = false;
	}

}
