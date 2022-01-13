import Parser from "../libs/Parser.js";
import {State} from "../Response.js";

export default {
	cost: _ => 1,
	fcost: _ => 0,
	legal: _ => true,
	serialize: _ => "state",
	execute: _ => [State],
	parse: game => Parser.seq([Parser.string("state"), Parser.end]),
};
