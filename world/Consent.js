const Consent = {

	parse: function (str) {
	},

	generateUUID: function (type, action) {
		return "CONSENT_" + type.generateUUID(action);
	}

	generate: function(type, action) {
		return randomString(Consent.generateUUID(type, action) + "_");
	},

	valid: function (consent, type, action, player) {
		if (player.consents.indexOf(consent) == -1)
			return false;
		var uuid = Consent.generateUUID(type, action);
		return consent.substr(0, uuid.length) == uuid;
	},

	use: function(consent, player) {
		if (player.consents.indexOf(consent) != -1)
			player.consents.splice(player.consents.indexOf(consent), 1);
	},

};
export default Consent;
