import net		from "net";
import {show, init, update} from "./Map.js";


function parseMessage(msg) {
	var idx = msg.indexOf(" ");
	switch(idx != -1 ? msg.substr(0, idx) : msg) {
		case 'state': return {type: "state", data: JSON.parse(msg.substr(idx + 1))};
		case 'context': return {type: "context", data: JSON.parse(msg.substr(idx + 1))};
		default: return {type: "welcome"};
	}
}



var port		= 62342;
var host		= "localhost";
var socket 	= net.createConnection(port, host, function() {

	console.log("listening");

	var buffer = "";
	socket.on("data", function (data) {
		//~ console.log("<from server>: " + data.toString().trim());
		var b = data.toString();

		if ( b[b.length - 1] != "\n" )
			buffer += b;

		else {
			notify((buffer + b).split("\n").map(x => x.trim()).filter(x => x.length));
			buffer = "";
		}

	});

});


var context;
var localisation;
var lastDirection;

function sendMessage(m) {
	lastDirection = m;
	//~ console.log(new Date, "sending message : ", m);
	socket.write(m == 'context' ? m : `move ${m}`);
	socket.write("\n");
}

function notify(messages) {

	var msgs = messages.map(parseMessage);

	for(var i = 0; i < msgs.length; i++)
		if ( msgs[i].type == "context" ) {
			context = msgs[i].data;
			msgs.splice(i, 1);
			i--;
		}

	if ( !context )
		return sendMessage('context');

	if ( msgs.length )
		return;

	if (!localisation)
		localisation = init(context);
	else
		localisation = update(localisation, lastDirection, context);

	show(localisation);


	sendMessage(decision(localisation));

}


function decision(localisation) {

	const deltas = {'west': {x: -1, y: 0}, 'east': {x: 1, y: 0}, 'south': {x: 0, y: 1}, 'north': {x: 0, y: -1}};
	function move(context, dir) {
		return context[deltas[dir].y + 1][deltas[dir].x + 1];
	}

	function filter(context, mv) {
		switch(mv) {
			case 'north': return move(context, mv).type != "wall";
			case 'south': return move(context, mv).type != "wall";
			case 'east': return move(context, mv).type != "wall";
			case 'west': return move(context, mv).type != "wall";
		}
	}

	const moves = ['north', 'east', 'west', 'south'].filter(move => filter(context, move));
	return moves[Math.floor(Math.random() * moves.length)];

}
