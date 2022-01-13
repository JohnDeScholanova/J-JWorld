import Parser from "../libs/Parser.js";
import {Context} from "../Response.js";

export default {
	cost: _ => 1,
	fcost: _ => 0,
	legal: _ => true,
	serialize: _ => "context",
	execute: _ => [Context],
	parse: game => Parser.seq([Parser.string("context"), Parser.end]),
};
