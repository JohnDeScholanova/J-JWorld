
function gaussian() { // -_-
	return (Math.random() + Math.random()) / 2;
}

var Fuel;
export default Fuel = {
	name: "fuel",
	make: (fuel = 0, rate = gaussian(), players = []) => ({type: Fuel, fuel, rate, players}),
};
