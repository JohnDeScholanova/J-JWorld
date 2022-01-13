
var Clock;
export default Clock = {
	name: "clock",
	make: (delta = 0, players = []) => ({type: Clock, delta, players}),
};
