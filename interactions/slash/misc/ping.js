const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription(
			"Get the current ping of the YWF Discord Bot."
		),

	async execute(interaction) {
		await interaction.reply(
			"My ping is \`" + interaction.client.ws.ping + " ms\`"
        );
	},
};
