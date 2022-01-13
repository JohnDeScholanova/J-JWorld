
var Goal;
export default Goal = {
	name: "goal",
	make: (goal = null, players = []) => ({type: Goal, goal, players}),
};

