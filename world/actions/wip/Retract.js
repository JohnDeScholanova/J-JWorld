import Parser from "../../libs/Parser.js";

const Retract = {

	parser: Parser.action(
		x => ({type: Retract, action: {}}),
		Parser.seq([
			Parser.string("retract"),
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
		var pos = player.consents.indexOf(action.consent);
		if (pos != -1)
			player.consents.splice(pos, 1);
	}

};
export default Retract;
