
var Marker;
export default Marker = {
	name: "marker",
	make: (id, players = []) => ({type: Marker, id, players}),
};
