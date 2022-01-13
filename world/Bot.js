import Game from "../Game/Game.js";
import Action from "../Game/Action.js";
import Result from "../Game/Result.js";

var idAgent = 97;
export default function StartAgent(timeout, game, f) {
	if (idAgent > 126)
		idAgent = 97;
	var player = Game.addPlayer(game, String.fromCharCode(idAgent++), 100000, 10000);
	LoopAgent(timeout, game, {f, player, state: {}, results: null});
}

function LoopAgent(timeout, game, agent) {
	var pos = agent.player.position;
	var {command, state} = agent.f(agent.player, game.map.cells[pos.y][pos.x], agent.state);
	var action = Action.parse(command);
	var results = action ? Action.run(action, game, agent.player).map(result => Result.serialize(result, game, agent.player)) :
			[`<PROTOCOL ERROR> Unknown command : ${command}\n`];
	if (agent.player.alive)
		setTimeout(() => LoopAgent(timeout, game, {...agent, state, results}), timeout);
	else Game.removePlayer(game, agent.player);
}
