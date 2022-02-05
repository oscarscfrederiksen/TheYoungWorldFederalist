module.exports = {
	name: ["your", "trigger", "words", "in", "array"],

	execute(message, args) {
		message.channel.send({
			content: "Set this trigger response from `./triggers/reactions/hello.js`",
		});
	},
};
