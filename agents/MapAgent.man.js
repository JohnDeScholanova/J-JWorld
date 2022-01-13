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
var ready = true;

function sendMessage(m) {
	if ( !ready )
		return;
	ready = false;
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

	if ( !context ) {
		ready = true;
		return sendMessage('context');
	}

	if ( msgs.length ) {
		ready = true;
		return;
	}

	if (!localisation)
		localisation = init(context);
	else
		localisation = update(localisation, lastDirection, context);

	ready = true;
	show(localisation);

}



var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        sendMessage('north');
    }
    if (key == '\u001B\u005B\u0043') {
        sendMessage('east');
    }
    if (key == '\u001B\u005B\u0042') {
        sendMessage('south');
    }
    if (key == '\u001B\u005B\u0044') {
        sendMessage('west');
    }

    if (key == '\u0003') { process.exit(); }    // ctrl-c
});
