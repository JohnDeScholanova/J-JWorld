import Parser from "../Parser.js";
import {State} from "../Response.js";

export default {
	serialize: action => "leave",
	parse: Parser.action(x => true, Parser.seq([Parser.string("leave"), Parser.end])),
	cost: (action, game, player) => 0,
	fcost: (action, game, player) => 0,
	legal: (action, game, player, cell) => player.online,
	process: (action, game, player, cell) => {
		player.leave();
		return [State];
	},
};
