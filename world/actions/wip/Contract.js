import Parser from "../../libs/Parser.js";

const Contract = {

	parser: Parser.action(
		x => ({type: Move, action: {}}),
		Parser.seq([
			Parser.string("contract"),
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
		player.consents.push(Consent.generate(eval(action.type), action.action));
	}

};
export default Contract;
