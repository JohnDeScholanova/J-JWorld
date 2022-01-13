import Parser from "../../libs/Parser.js";

const Waste = {

	parser: Parser.action(
		x => ({type: Waste, action: {}}),
		Parser.seq([Parser.string("waste"), Parser.end])
	),

	cost: function(action, player, game) {
		return 1;
	},

	fcost: function(action, player, game) {
		return 0;
	},

	legal: function (action, player, game) {
		return game.map.cells[player.position.y][player.position.x].sym == 'F';
	},

	process: function (action, player, game) {
		game.map.cells[player.position.y][player.position.x].fuel -= Math.min(1, game.map.cells[player.position.y][player.position.x].fuel);
	},
};
export default Waste;
