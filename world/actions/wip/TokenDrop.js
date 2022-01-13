import Parser from "../../libs/Parser.js";

const TokenDrop = {

	parser: Parser.action(
		x => ({type: TokenDrop, action: {}),
		Parser.seq([
			Parser.string("token drop"),
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
		game.cells[player.position.y][player.position.x].tokens.push(action.token);
	}
};
export default TokenDrop;
