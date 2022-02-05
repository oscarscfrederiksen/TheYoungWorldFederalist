module.exports = {
	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! Use the \`/help\` to get more info on what I can do.`
		);
	},
};
