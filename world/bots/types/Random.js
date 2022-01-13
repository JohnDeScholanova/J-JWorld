import Action from "../../Game/Action.js";
import Move from "../../Game/actions/Move.js";


function randomAction() {
	const moves = [
		'move - -', 'move - 0', 'move - +',
		'move 0 -', 'load',	'move 0 +',
		'move + -', 'move + 0',	'move + +',
	];
	return moves[Math.floor(Math.random() * moves.length)];
}

export default function Random(player, cell, state, results) {
	return {state, command: randomAction()};
}
