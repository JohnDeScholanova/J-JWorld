
export const Context	= {"type": "context"};
export const State	= {"type": "state"};
export const Miss	= {"type": "miss"};
export const Fill	= {"type": "fill"};
export const Illegal	= {"type": "illegal"};
export const NoFuel	= {"type": "nofuel"};
export const NoGold	= {"type": "nogold"};
export const Dead	= {"type": "dead"};



//~ export const NoEffect = {"type": "noeffect"};
//~ export const Bye = {"type": "bye"};
//~ export const Nothing = {"type": "nothing"};
//~ export const Offline = {"type": "offline"};
//~ export const System = message => ({"type": "system", message});

function getState(player) {
	return JSON.stringify({
		id: player.id,
		online: player.online,
		gold: player.gold,
		fuel: player.fuel,
		position: player.position,
	});
}

const Response = {

	serialize: function (response, game, player, cell) {
		switch (response.type)  {
			//~ case "nothing": return "";
			//~ case "system": return `system ${response.message}`;
			//~ case "offline": return `offline`;
			case "state": return `state ${getState(player)}`;
			case "context": return `context ${JSON.stringify(cell.getContext())}`;
			default: return response.type;
		}
	},

	write: function(response, write) {
		write("###############\n");
		write(`# ${response.type}\n`);
		write("###############\n");
	},

};
export default Response;
