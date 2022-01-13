import Parser from "../../libs/Parser.js";

const Bet = {

	serialize: function (action) {
		return `bet ${action.player1} <${action.amount}> ${action.player2}`;
	},

	parser: Parser.action(
		x => ({type: Bet, action: {axe: x[2], delta: x[4]}}),
		Parser.seq([
			Parser.string("bet"),
			Parser.space,
			Parser.playerId,
			Parser.string(" <"),
			Parser.string("> "),
			Parser.playerId,
			Parser.end,
		])
	),

	cost: function(action, player, game) {
		return 10;
	},

	fcost: function(action, player, game) {
		return 0;
	},

	legal: function (action, player, game) {
		var player2 = game.players[player.id == action.player1 ? action.player2 : action.player1];
		return
			player.money >= action.amount && player2.money >= action.amount &&
			Consent.valid(action.consent, MoneyBet, action, player2);
	},

	process: function (action, player, game) {
		var player2 = game.players[player.id == action.player1 ? action.player2 : action.player1];
		Consent.use(action.consent, player2);
		var winner, looser;
		if (Math.random() > 0.5) {
			winner = player1;
			looser = player2;
		} else {
			winner = player2;
			looser = player1;
		}
		winner.money += action.amount;
		looser.money -= action.amount;
	}
};
export default Bet;
