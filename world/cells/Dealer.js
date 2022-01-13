
var Dealer;
export default Dealer = {
	name: "dealer",
	make: (open = false, tokens = [], players = []) => ({type: Dealer, open, tokens, players}),
};
