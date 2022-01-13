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

	return findNext(localisation);

}



function findNext({position: p, map}) {
	var lst = getNext({position: p, map});
	var visited = {};
	var np;
	while (lst.length) {
		np = lst.shift();
		if ( visited[np.x + '-' + np.y] )
			continue;
		visited[np.x + '-' + np.y] = true;
		if (!map[np.y][np.x].visited)
			return np.move;
		else
			lst = lst.concat(getNext({position: np, map}, np.move));
	}
	process.exit();
}

function getNext({position: p, map}, firstMove) {
	var lst = [];

	if ( map[p.y][p.x - 1].type != 'wall' )
		lst.push({x: p.x - 1, y: p.y, move: firstMove || "west"});

	if ( map[p.y - 1][p.x].type != 'wall' )
		lst.push({x: p.x, y: p.y - 1, move: firstMove || "north"});

	if ( map[p.y][p.x + 1].type != 'wall' )
		lst.push({x: p.x + 1, y: p.y, move: firstMove || "east"});

	if ( map[p.y + 1][p.x].type != 'wall' )
		lst.push({x: p.x, y: p.y + 1, move: firstMove || "south"});

	return lst;
}



