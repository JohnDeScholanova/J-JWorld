import * as Cells	from "./Cells.js";

export default function(space, position, cell) {
	function recmap(x, f) {
		return x.map ? x.map(y => recmap(y, f)) : f(x);
	}
	return cell = {
		...cell,
		delta:		dir	=> space.cell(space.apply(position, dir)),
		publish:	cell	=> ({...cell, type: cell.type.name}),
		getContext:	_	=> recmap(space.getContext(position), cell.publish),
	};
}
