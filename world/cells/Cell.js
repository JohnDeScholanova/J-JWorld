
var Cell;
export default Cell = {
	name: "cell",
	make: (state = false, formula = null, tokens = [], players = []) => ({type: Cell, state, formula, tokens, players}),
};
