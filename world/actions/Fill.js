import Parser from "../libs/Parser.js";
import {Fill, Miss} from "../Response.js";

export default {
	cost: _ => 0,
	fcost: _ => 0,
	serialize: _ => "fill",
	parse: game => Parser.seq([Parser.string("fill"), Parser.end]),
	legal: (action, game, player, cell) => cell.fuel >= 0 && player.fuel < game.conf.USER_MAXFUEL,
	execute: (action, game, player, cell) => {
		const load = Math.min(1, cell.fuel);
		cell.fuel -= load;
		player.fuel += load;
		return [load ? Fill : Miss];
	},
};
