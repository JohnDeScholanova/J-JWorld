import {EOL} from 'os';
import Cell from "../Cell.js";
import {Wall, Fuel, Gold, Flag, Portal, Cell as Space, Start, Goal, Trap, Dealer, Bit, Origin, Marker, Clock, Oracle, Info} from "../Cells.js";

export default {read: Reader, write: Writer};

const deltas = {"east": {x: 1, y: 0}, "west": {x: -1, y: 0}, "north": {x: 0, y: -1}, "south": {x: 0, y: 1}};

function SimpleMap(map) {
	var self, players = {}, positions = {};

	function cell({x, y}) {
		return map.cells[y][x];
	}

	return self = {
		playerCell: id => cell(positions[id]),
		cell, players, positions,
		directions: ["east", "west", "north", "south"],
		writeState: write => JSON.stringify(map),
		write: (write, comments) => Writer(map, write, comments),
		getRandomStart: () => Object.assign({}, map.starts[Math.floor(Math.random() * map.starts.length)].position),
		apply({x, y}, dir) {
			return {x: x + deltas[dir].x, y: y + deltas[dir].y};
		},
		getMap() {
			return map;
		},
		getPlayers() {
			return Object.values(players);
		},
		getContext(pos) {
			var context = [[], [], []];
			for(var i = -1; i <=  1; i++)
				for(var j = -1; j <= 1; j++)
					context[i + 1][j + 1] = map.cells[pos.y + i][pos.x + j];
			return context;
		},
		add(p, pos = self.getRandomStart()) {
			if (!players[p.id]) {
				cell(pos).players[p.id] = p;
				positions[p.id] = pos;
				players[p.id] = p;
			}
			return p;
		},
		move(p, dir) {
			if (players[p.id]) {
				delete cell(positions[p.id]).players[p.id];
				var pos = self.apply(positions[p.id], dir);
				cell(pos).players[p.id] = p;
				positions[p.id] = pos;
			}
			return p;
		},
		remove(p) {
			if (players[p.id]) {
				delete cell(positions[p.id]).players[p.id];
				delete positions[p.id];
				delete players[p.id];
			}
			return p;
		},
	}
}

function _Cell(sym) {
	switch(sym) {
		case ' ': return Space.make();
		case 'S': return Start.make();
		case 'G': return Goal.make();
		case 'D': return Dealer.make(true);
		case 'd': return Dealer.make(false);
		case '!': return Trap.make();
		case '$': return Gold.make();
		case '+': return Fuel.make();
		case '🌢': return Fuel.make();
		case '?': return Oracle.make();
		case 'i': return Info.make();
		case 'O': return Origin.make();
		case 'o': return Marker.make();
		case 'C': return Clock.make(1);
		case 'c': return Clock.make(0);
		case 'B': return Bit.make(true);
		case 'b': return Bit.make(false);
		case 'F': return Flag.make(true);
		case 'f': return Flag.make(false);
		default: return "& @ % * ~ § £ ¤".indexOf(sym) != -1 ? Portal.make(sym) : Wall.make(sym);
	}
}

function _Sym(cell) {
	switch(cell.type) {
		case Space: return ' ';
		case Gold: return '$';
		case Trap: return '!';
		case Oracle: return '?';
		case Info: return 'i';
		case Wall: return cell.chr;
		case Portal: return cell.id;
		case Flag: return cell.raised ? 'F' : 'f';
		case Fuel: return '🌢';
		case Clock: return cell.delta % 2 ? 'C' : 'c';
		case Bit: return cell.state ? 'B' : 'b';
		case Dealer: return cell.open ? 'D' : 'd';
		case Start: return 'S';
		case Goal: return 'G';
		case Origin: return 'O';
		case Marker: return 'o';
		default: console.log(cell); throw new Error("Unknown cell type !");
	}
}

export function Writer(map, write, comments = false) {
	var str = comments ? map.comments.join("\n") + "\n" : "";
	var cell, players;
	for(var i = 0; i < map.cells.length; i++) {
		for(var j = 0; j < map.cells[i].length; j++) {
			cell = map.cells[i][j];
			players = cell.type == Wall ? [] : Object.values(cell.players);
			if (cell.type == Wall || !players.length)
				str += (_Sym(cell));
			else {
				if (players.length == 1)
					str += (players[0].id.substr(0, 1));
				else str += (`${Math.min(players.length, 9)}`);
			}
		}
		str += ("\n");
	}
	write(str);
}

export function Reader(mapString) {

	var map = {comments: [], portals: {}, starts: [], alives: [], cells: []};
	var space = SimpleMap(map);

	var len, row, cell, y = 0;
	for(var line of mapString.trim().split(EOL).filter(l => l.length).map(l => l.trim()))
		if ( line[0] == '/' )
			map.comments.push(line);
		else {
			row = [];
			map.cells.push(row);
			if (!len) len = line.length;
			else if (len != line.length)
				throw new Error("Invalid map : line of different length on line " + (y + 1) + ", " + len + " != " + line.length);
			for(var x = 0; x < line.length; x++) {
				row.push(Cell(space, {x, y}, _Cell(line[x])));
				index(map, {cell: row[x], position: {x, y}});
			}
			y++;
		}

	if ( !map.starts.length )
		throw new Error("Invalid map : no start location !");

	return space;

}

function portal(map, p) {
	if (!map.portals[p.cell.id])
		map.portals[p.cell.id] = [];
	map.portals[p.cell.id].push(p);
}

function start(map, s) {
	map.starts.push(s);
}

function alive(map, a) {
	map.alives.push(a);
}

function index(map, d) {
	switch(d.cell.type) {
		case Goal: break;
		case Gold: break;
		case Info: break;
		case Marker: break;
		case Oracle: break;
		case Origin: break;
		case Trap: break;
		case Wall: break;
		case Cell: break;
		case Flag: break;
		case Portal: return portal(map, d);
		case Start: return start(map, d);
		case Fuel: return alive(map, d);
		case Bit: return alive(map, d);
		case Dealer: return alive(map, d);
		case Clock: return alive(map, d);
	}
}

