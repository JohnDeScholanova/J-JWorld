
export default function(agentFactory) {

	return function(socket) {

		//~ console.log("Connected to server");

		var buffer = "";
		var agent = agentFactory();
		socket.on("data", handle);
		socket.on('end', () => console.log('disconnected from server'));

		function sendMessage(m) {
			socket.write(m);
			socket.write("\n")
		}

		function notify(messages) {
			setTimeout(() => agent(sendMessage, messages), 0);
		}

		function handle(data) {
			//~ console.log("<from server>: " + data.toString().trim());
			var b = data.toString();

			if ( b[b.length - 1] != "\n" )
				buffer += b;

			else {
				notify((buffer + b).split("\n").map(x => x.trim()).filter(x => x.length));
				buffer = "";
			}

		}

	}

};
