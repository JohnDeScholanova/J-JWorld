const Parser = {
	true: function(state, str) {
		return [true];
	},
	expr: f => function(state, str) {
		return [f()];
	},
	ifexpr: f => function(state, str) {
		var x = f();
		return x ? [x] : null;
	},
	action: (f, p) => function(state, str) {
		const n = p(state, str);
		return n ? [f(n[0], state)] : n;
	},
	filter: (f, p) => function(state, str) {
		const n = p(state, str);
		return n && f(n[0], state) ? n : null;
	},
	value: (v, p) => function(state, str) {
		const n = p(state, str);
		return n ? [v] : n;
	},
	end: function(state, str) {
		return state.pos < str.length ? null : ['$'];
	},
	space: function(state, str) {
		return Parser.string(' ')(state, str);
	},
	playerId: function(state, str) {
		return Parser.regex(/^[_a-zA-Z][_a-zA-Z0-9]*/)(state, str);
	},
	tokenId: function(state, str) {
		return Parser.regex(/^[^ ]+/)(state, str);
	},
	rest: function(state, str) {
		return Parser.regex(/^.+/)(state, str);
	},
	nat: function(state, str) {
		const n = Parser.regex(/^\d+/)(state, str);
		return n ? [parseInt(n[0])] : n;
	},
	int: function(state, str) {
		const sign = Parser.string("-")(state, str);
		const n = Parser.regex(/^\d+/)(state, str);
		return n ? [parseInt((sign ? -1 : 1 ) * n[0])] : n;
	},
	string: s => function(state, str) {
		if (str.length - state.pos >= s.length && str.substr(state.pos, s.length) == s) {
			state.pos += s.length;
			return [s];
		}
		return null;
	},
	regex: r => function(state, str) {
		var match = str.substr(state.pos).match(r);
		if (match && !match.index) {
			state.pos += match[0].length;
			return [match[0]];
		}
		return null;
	},
	seq: pseq => function(state, str) {
		var n, ns = [];
		for(var p of pseq) {
			n = p(state, str);
			if (!n) return null;
			ns.push(n[0]);
		}
		return [ns];
	},
	alt: palt => function(state, str) {
		var n, pos = state.pos;
		for(var p of palt) {
			if (n = p(state, str))
				return n;
			state.pos = pos;
		}
		return null;
	},
	any: p => function(state, str) {
		var n = p(state, str);
		return n ? n : [null];
	},
	many: p => function(state, str) {
		var n;
		var ns = [];
		while(n = p(state, str))
			ns.push(n[0]);
		return [ns];
	},
	more: p => function(state, str) {
		var n = p(state, str);
		if (!n) return n;
		return [n.concat(Parser.many(p)(state, str)[0])];
	},
};
export default Parser;

