export default function(game, id, gold = 0, fuel = 0) {
	var self;
	return self = {
		id, gold, fuel, game,
		write(player, write) {
			write(Player.getLines(player).join("\n") + "\n");
		},
		getLines(i = 0, j = 0, x = 0, y = 0) {
			var pos = game.space.positions[id];
			var lines = [
				(!i && !j ? "╔" : (!j ? "╠" : (!i ? "╦" : "╬"))) + "═══════════════",
				`║ ${self.id} [${!self.alive ? "LIVE" : "DEAD"}] `,
				`║ $: ${self.gold} `,
				`║ F: ${self.fuel}`,
				`║ x: ${pos.x}, y: ${pos.y} `,
			];
			var n = lines[0].length;
			lines = lines.map(l => l + (new Array(n - l.length + 1)).join(' '));
			//~ lines[lines.length] += " ";
			return lines;
		},
	};
}
