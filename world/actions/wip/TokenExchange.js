import Parser from "../../libs/Parser.js";

const TokenExchange = {

	serialize: function(action) {
		return `token exchange ${action.player1} ${action.token1} ${action.token2} ${action.player2}`;
	},

	parser: Parser.action(
		x => ({type: Move, action: {axe: x[2], delta: x[4]}}),
		Parser.seq([
			Parser.string("token exchange "),
			Parser.end,
		])
	),

	generateUUID: function (action) {
		return "TokEx:" + action.source + ":" action.token1 + ":" + action.target + ":" + action.token2;
	},

	cost: function(action, player, game) {
		return 0;
	},

	fcost: function(action, player, game) {
		return 0;
	},

	legal: function (action, player, game) {
		return player.tokens.indexOf(action.token1) != -1
			&& game.players[action.target].tokens.indexOf(action.token2)
			&& player.id == action.source
			&& Consent.valid(action.consent, TokenExchange, action, game.players[action.target]);
	},

	process: function (action, player, game) {
		Consent.use(action.consent, game.players[action.target]);
		player.tokens.splice(player.tokens.indexOf(action.token1), 1);
		player.tokens.push(action.token2);
		game.players[action.target].tokens.splice(player.tokens.indexOf(action.token2), 1);
		game.players[action.target].tokens.push(action.token1);
	},

};
export default TokenExchange;
