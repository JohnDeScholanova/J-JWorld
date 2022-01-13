import Parser from "../../libs/Parser.js";

const Send = {

	parser: Parser.action(
		x => ({type: Send, action: {target: , amount: }),
		Parser.seq([
			Parser.string("send "),
			Parser.nat,
			Parser.end,
		])
	),

	cost: function(action, player, game) {
		return 0;
	},

	fcost: function(action, player, game) {
		return 0;
	},

	legal: function (action, player, game) {
		return action.amount > 0 && player. >= action.amount;
	},

	process: function (action, player, game) {
		player. -= action.amount;
		game.players[action.target]. += action.amount;
	}
};
export default Send;
