import SocketAgent from "./SocketAgent.js";


const deltas = {'move west': {x: -1, y: 0}, 'move east': {x: 1, y: 0}, 'move south': {x: 0, y: 1}, 'move north': {x: 0, y: -1}};
function move(context, dir) {
	return context[deltas[dir].y + 1][deltas[dir].x + 1];
}


function filter(context, state, mv) {
	switch(mv) {
		case 'move north': return move(context, mv).type != "wall";
		case 'move south': return move(context, mv).type != "wall";
		case 'move east': return move(context, mv).type != "wall";
		case 'move west': return move(context, mv).type != "wall";
		case 'fill': return context[1][1].type == "fuel";
	}
}


function parseMessage(msg) {
	var idx = msg.indexOf(" ");
	switch(idx != -1 ? msg.substr(0, idx) : msg) {
		case 'state': return {type: "state", data: JSON.parse(msg.substr(idx + 1))};
		case 'context': return {type: "context", data: JSON.parse(msg.substr(idx + 1))};
		default: return {type: "welcome"};
	}
}

export default SocketAgent(function() {

	var ready = Promise.resolve();
	var context = null;
	var state = null;

	function delay(timeout) {
		return ready = ready.then(() => new Promise((r,j) => setTimeout(r, timeout)));
	}

	return (sendMessage, messages) => {
		console.log(new Date, messages);
		var msgs = messages.map(parseMessage);

		for(var i = 0; i < msgs.length; i++)
			if ( msgs[i].type == "context" ) {
				context = msgs[i].data;
				msgs.splice(i, 1);
				i--;
			}
		for(var i = 0; i < msgs.length; i++)
			if ( msgs[i].type == "state" ) {
				state = msgs[i].data;
				msgs.splice(i, 1);
				i--;
			}

		if ( !state ) return sendMessage('state');
		if ( !context ) return sendMessage('context');

		//~ if ( msgs.length ) {
			//~ console.log("Still messages !!!!");
			//~ console.log({context, state}, msgs);
			//~ console.log(messages);
			//~ messages.lol();
		//~ }
		//~ console.log(messages);
		//~ console.log("looping !!!!!");
		const moves = ['move north', 'move east', 'move west', 'move south', 'fill'].filter(move => filter(context, state, move));
		//~ console.log("sending to server : ", mv);
		if (moves.length) delay(300).then(() => {
			const mv = moves[Math.floor(Math.random() * moves.length)];
			//~ console.log("sending to server : ", mv);
			sendMessage(mv)
		});
	};

});
