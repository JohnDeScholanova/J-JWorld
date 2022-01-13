import * as Actions	from "./Actions.js";
import Parser		from "./libs/Parser.js";

var Action;
export default Action = {
	serialize: ({type, data}) => type.serialize(data),
	parse: game => Parser.alt(Object.values(Actions).map(t => Parser.action(d => ({type: t, data: d}), t.parse(game)))),
};
