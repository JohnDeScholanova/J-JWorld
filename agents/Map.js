
const deltas = {
	west: {x: -1, y: 0},
	east: {x: 1, y: 0},
	south: {x: 0, y: 1},
	north: {x: 0, y: -1},
};

function move(position, delta) {
	return {
		x: position.x + delta.x,
		y: position.y + delta.y
	};
}

const unknown = () => ({type: "undefined", visited: false});

function makeLine(size) {
	var x = new Array(size);
	for(var i = 0; i < size; i++)
		x[i] = unknown();
	return x;
}


export function show(data) {
	var str = "";
	var x = 0, y = 0;
	for (var l of data.map) {
		for(var c of l) {
			if ( data.position.x == x && data.position.y == y )
				str += "X";
			else switch (c.type) {

				case "undefined":
					str += "?";
					break;

				case "wall":
					str += "#";
					break;

				case "fuel":
					str += "ðŸŒ¢";
					break;

				case "start":
					str += "S";
					break;

				case "portal":
					str += c.id;
					break;

				case "gold":
					str += "$";
					break;

				default:
					str += c.visited ? ' ' : '.'
			}
			x += 1;
		}
		y += 1;
		x = 0;
		str += "\n"
	}
	console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
	console.log(str);
}


export function init(context) {
	return {position: {x: 1, y: 1}, map: context};
}


export function update({position, map}, direction, context) {

	position = move(position, deltas[direction]);
	var minPos = {x: position.x - 1, y: position.y - 1};
	var maxPos = {x: position.x + 1, y: position.y + 1};

	// ajouter une colonne à gauche
	if (minPos.x < 0) {
		for(var i = 0; i < map.length; i++)
			map[i].unshift(unknown());
		position.x += 1;
	}

	// ajouter une ligne en haut
	if (minPos.y < 0) {
		map.unshift(makeLine(map[0].length));
		position.y += 1;
	}

	// ajouter une colonne à droit
	if (maxPos.x >= map[0].length)
		for(var i = 0; i < map.length; i++)
			map[i].push(unknown());

	// ajouter une ligne en bas
	if (maxPos.y >= map.length)
		map.push(makeLine(map[0].length));

	for(var i = -1; i <= 1; i++)
		for(var j = -1; j <= 1; j++)
			for (var k in context[i + 1][j + 1])
			map[position.y + i][position.x + j][k] = context[i + 1][j + 1][k];

	map[position.y][position.x].visited = true;
	return {position, map};

}
