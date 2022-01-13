
var Bit;
export default Bit = {
	name: "bit",
	make: (state = false, players = []) => ({type: Bit, state, players}),
};
