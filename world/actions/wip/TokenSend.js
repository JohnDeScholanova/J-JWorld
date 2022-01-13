import Parser from "../../libs/Parser.js";

const TokenSend = {

	parser: Parser.action(
		x => ({type: Move, action: {axe: x[2], delta: x[4]}}),
		Parser.seq([
			Parser.string("move"),
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
		return player.tokens.indexOf(action.token) != -1;
	},

	process: function (action, player, game) {
		player.tokens.splice(player.tokens.indexOf(action.token), 1);
		game.players[action.target].tokens.push(action.token);
	}
};
export default TokenSend;
