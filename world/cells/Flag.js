
var Flag;
export default Flag = {
	name: "flag",
	make: (raised = false, players = []) => ({type: Flag, raised, players}),
};
