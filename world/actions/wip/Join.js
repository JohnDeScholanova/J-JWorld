import Parser from "../Parser.js";
import {State, Context} from "../Response.js";

export default {
	serialize: action => "join",
	parse: Parser.action(x => true, Parser.seq([Parser.string("join"), Parser.end])),
	cost: (action, game, player) => 0,
	fcost: (action, game, player) => 0,
	legal: (action, game, player, cell) => !player.online,
	process: (action, game, player, cell) => {
		player.join();
		return [State, Context];
	},
};
