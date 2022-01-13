
var Portal;
export default Portal = {
	name: "portal",
	make: (id, players = []) => ({type: Portal, id, players}),
};

