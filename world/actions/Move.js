import Parser from "../libs/Parser.js";
import {Wall} from "../Cells.js";
import {Context} from "../Response.js";

export default {
	cost: _ => 0,
	fcost: _ => 1,
	serialize: dir => `move ${dir}`,
	legal: (dir, game, {fuel}, cell) => cell.delta(dir).type != Wall && fuel > 0,
	execute: (dir, game, player) => {
		game.space.move(player, dir);
		return [Context];
	},
	parse: game => Parser.action(
		x => x[1],
		Parser.seq([
			Parser.string("move "),
			Parser.alt(game.space.directions.map(Parser.string)),
			Parser.end,
		])
	),
};
