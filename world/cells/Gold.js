
var Gold;
export default Gold = {
	name: "gold",
	make: (gold = 0, players = []) => ({type: Gold, gold, players}),
};
