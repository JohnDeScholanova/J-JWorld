import Parser from "../Parser.js";
import Game from "../Game.js";
import {Fuel, NoEffect} from "../Result.js";

const Portal = {

	cost(action, game, player) {
		return 1;
	},

	fcost(action, game, player) {
		return 0;
	},

	legal(action, game, player) {
		return game.map.cells[player.position.y][player.position.x].type == 'portal';
	},

	process(action, game, player) {
		var tgts = game.map.portals[game.map.cells[player.position.y][player.position.x].id];
		Object.assign(player.position, tgts[Math.floor(Math.random() * tgts.length)]);
	},

	serialize(action) {
		return "portal";
	},

	parser: Parser.action(
		x => ({type: Move, action: {}}),
		Parser.seq([
			Parser.string("portal"),
			Parser.end,
		])
	),

};
export default Portal;
