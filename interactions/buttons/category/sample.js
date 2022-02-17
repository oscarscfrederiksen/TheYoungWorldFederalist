module.exports = {
	id: "sample",

	async execute(interaction) {
		const interactionDescription = interaction.message.embeds[0].description.toString()
		const userId = interactionDescription.substring(
			interactionDescription.indexOf("<@") + 2,
			interactionDescription.lastIndexOf(">")
		)
		console.log(id)
		return;
	},
};
