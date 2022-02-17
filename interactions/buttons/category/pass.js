const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	id: "pass",

	async execute(interaction) {
		const updatedRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("pass")
				.setLabel("Pass")
				.setStyle("SUCCESS")
				.setDisabled(true),
			new MessageButton()
				.setCustomId("warn")
				.setLabel("Warn")
				.setStyle("DANGER")
				.setDisabled(true),
			new MessageButton()
				.setCustomId("removeSlur")
				.setLabel("Remove Slur")
				.setStyle("PRIMARY")
				.setDisabled(true),
		)
		const updatedEmbed = new MessageEmbed(interaction.message.embeds[0])
		updatedEmbed.setColor("#8bb149")
		updatedEmbed.setTitle(`${interaction.message.embeds[0].title} (Resolved: Passed)`)
		await interaction.message.edit({
			embeds: [updatedEmbed],
			components : [updatedRow]
		});
		interaction.deferUpdate()
	},
};
