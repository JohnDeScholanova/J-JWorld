import Illegal from "./Response.js";
import NoFuel from "./Response.js";
import NoGold from "./Response.js";
import Dead from "./Response.js";
import Action from "./Action.js";
import Player from "./Player.js";

const defaultConfiguration = {
	USER_STARTGOLD:	1,
	USER_STARTFUEL:	5,
	USER_MAXFUEL:	10,
};


function writerToLines(writer) {
	var buf = "";
	writer(x => buf += x);
	return buf.split("\n").filter(x=>x.length);
}

export default function(space, conf = {}) {

	var time = 0;

	var self = {time, space, conf,

		addPlayer: (id, gold = 0, fuel = 0) => space.add(Player(self, id, gold, fuel)),
		removePlayer: player => space.remove(player),

		writeStatus(write) {
			write(`${Object.values(space.players).length} player(s) total\n${(new Date()).toString()}\n`);
		},

		writePlayers(write, x = 5) {
			var pheight, pwidth;
			var players = space.getPlayers();
			var y = Math.ceil(players.length / x);
			var lines = [];
			for(var i = 0; i < y; i++)
				for(var j = 0; j < x && i * x + j < players.length; j++)
					players[i * x + j].getLines(i, j, x, y).forEach((l, n, a) => {
						pheight = a.length;
						pwidth = l.length;
						if (!lines[i * pheight + n]) lines[i * pheight + n] = "";
						lines[i * pheight + n] += l;
					});

			lines[0] += "╗";
			for(var i = 1; i < lines.length - 1; i++)
				lines[i] += i % pheight ? "║" : (lines[i].length == lines[0].length - 1 ? "╣" : "╬");
			lines[lines.length - 1] += "║";

			lines.push("╚");
			for(var i = 1; i < lines[lines.length - pheight].length - 1; i++)
				lines[lines.length - 1] += i % (pwidth ) ? "═" : "╩";
			lines[lines.length - 1] += "╝";

			if (players.length % x) {
				for(var i = 1, z = lines[0].length - lines[lines.length - pheight].length; i < z; i++)
					lines[lines.length - pheight - 1] += i % (pwidth ) ? "═" : "╩";
				if (lines.length - pheight - 1 > 0) lines[lines.length - pheight - 1] += "╝";
			}

			write(`${lines.join("\n")}\n`);
		},

		parse: (state, pos) => Action.parse(self)(state, pos),

		start(Loop) {

		},

		refresh(actions) {
			//~ var legals = treatIllegals(actions);
			//~ var feasible = treatFeasible(actions);
			var responses = [];
			for (var [id, {action, writer}] of actions)
				if (space.players[id])
					responses.push([space.players[id], self.run(action, self, space.players[id]), writer]);
			return responses;
		},

		run(action, game, player) {

			if ( !player.gold && !player.fuel )
				return [Dead];

			var cost = action.type.cost(action.data, game, player);
			var fcost = action.type.fcost(action.data, game, player);
			var responses, hasChanged = false;

			if ( !action.type.legal(action.data, game, player, space.playerCell(player.id)) ) {
				player.gold -= Math.min(1, player.gold);
				player.gold -= Math.min(1, player.gold);
				responses = [Illegal];
			} else if ( cost > player.gold )
				responses = [NoGold];
			else if ( fcost > player.fuel )
				responses = [NoFuel];
			else {
				player.gold -= cost;
				player.fuel -= fcost;
				responses = action.type.execute(action.data, game, player, space.playerCell(player.id));
				//~ hasChanged = responses.length == 1 && responses[0] != NoEffect;
			}
			if ( player.gold < 1 && player.fuel < 1 ) {
				player.alive = 0;
				responses.push(Dead);
			}

			return responses;

		}




	};

	return self;

}



