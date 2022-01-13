import Parser from "../../libs/Parser.js";

const Message = {

	parser: Parser.action(
		x => ({type: Move, action: {axe: x[2], delta: x[4]}}),
		Parser.seq([
			Parser.string("move"),
			Parser.end,
		])
	),

	cost: function(action, player, game) {
		return 1;
	},

	legal: function (action, player, game) {
		return true;
	},

	process: function (action, player, game) {
	}

};
export default Message;
