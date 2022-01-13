import Parser from "../../libs/Parser.js";

const Steal = {

	parser: Parser.action(
		x => ({type: Steal, action: {}),
		Parser.seq([
			Parser.string("steal"),
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
			player. = Math.floor(player.);
			game.players[action.target]. += player. / 2;
		}
	}
};
export default Steal;
