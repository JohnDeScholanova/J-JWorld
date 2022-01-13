import fs		from "fs";
import net		from "net";
import readline		from "readline";

//////////////////////////////////////////
// import agents
//////////////////////////////////////////
import RandomAgent	from "./agents/Random.js";
import StupidAgent	from "./agents/Stupid.js";
import MapAgent		from "./agents/MapAgent.js";
//////////////////////////////////////////
// put them in a hashtable
//////////////////////////////////////////
const Agents		= {RandomAgent, StupidAgent, MapAgent};

var port		= 62342;
var host		= "localhost";
var dataQueue		= [];

for(var i = 0, as = parseInt(process.argv[2]); i < as; i++)
	(function () {
		var socket = net.createConnection(port, host, function() {
			Agents[process.argv[process.argv.length - 1]](socket)
		});
	})();

//~ function lol(socket) {

	//~ console.log("Connected to server");
	//~ var buffer	= "";
	//~ socket.on("data", handle);
	//~ socket.on('end', () => console.log('disconnected from server'));

	//~ function handle(data) {
		//~ console.log("<from server>: " + data.toString().trim());
		//~ var b = data.toString();
		//~ if ( b[b.length - 1] != "\n" )
			//~ buffer += b;
		//~ else {
			//~ var responses = (buffer + b).split("\n").map(x => x.trim()).filter(x => x.length);
			//~ while(responses.length)
				//~ dataQueue.push(responses.shift());
			//~ buffer = "";
			//~ var msgs = dataQueue;
			//~ dataQueue = [];
			//~ setTimeout(function() {
				//~ Agents[process.argv.length > 2 ? process.argv[2] : RandomAgent](m => socket.write(m + "\n"), msgs)
			//~ }, 0);
		//~ }
	//~ }

//~ }


//~ var waitQueue = [];
//~ var dataQueue = [];
//~ function send(text) {
	//~ return new Promise((r,j) => {
		//~ socket.write(text);
		//~ if (dataQueue.length)
			//~ r(dataQueue.shift());
		//~ else waitQueue.push(r);
	//~ }).then(d => new Promise((r, j) => setTimeout(() => r(d), 500)));
//~ }

//~ const rl = readline.createInterface({
    //~ input: process.stdin,
    //~ output: process.stdout
//~ });
//~ rl.on("close", function() {
    //~ console.log("\nBYE BYE !!!");
    //~ process.exit(0);
//~ });

//~ function startPrompt() {
	//~ rl.question("", function(command) {
		//~ socket.write(command + "\n");
		//~ console.log("Sending command : " + command.toString());
		//~ startPrompt();
	//~ });
//~ }
//~ startPrompt();

	//~ if (q > 100) {
		//~ console.log('bye');
		//~ return;
	//~ }
	//~ console.log('run : ' + q);
	//~ if (player.fuel < 10000 && cell.type == '' && state.fuel != player.fuel) {
		//~ state.fuel = player.fuel;
		//~ Action.process(FuelLoad, {}, player, game);
		//~ console.log("agent: fuel");
	//~ } else {
		//~ if (state.fuel) state.fuel = 0;
		//~ var action;
		//~ if ( !state.lastAction || player.position.x == state.lastx && player.position.y == state.lasty ) {
			//~ action = {axe: Math.random() > 0.5 ? "x" : "y", delta: Math.random() > 0.5 ? 1 : -1};
			//~ state.lastAction = action;
		//~ } else if (Math.random() > 0.8) {
			//~ action = {axe: Math.random() > 0.5 ? "x" : "y", delta: Math.random() > 0.5 ? 1 : -1};
		//~ } else action = state.lastAction;
		//~ state.lastx = player.position.x;
		//~ state.lasty = player.position.y
		//~ Action.process(Move, action, player, game);
		//~ console.log("agent: move", action);
	//~ }
	//~ if (monitors) for(var i = 0; i < monitors.length; i++) try {
		//~ clearScreen(monitors[i]);
	//~ } catch(e) {}
