import Parser from "../../libs/Parser.js";

const TokenSteal = {

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
		return true;
	},

	process: function (action, player, game) {
		if (game.players[action.target].tokens.indexOf(action.token) != -1 && Math.random() > 0.66666666) {
			player.tokens.push(action.token);
			game.players[action.target].tokens.splice(player.tokens.indexOf(action.token), 1);
		} else {
			player.money = Math.floor(player.money);
			game.players[action.target].money += player.money / 2;
		}
	}
};
export default TokenSteal;
