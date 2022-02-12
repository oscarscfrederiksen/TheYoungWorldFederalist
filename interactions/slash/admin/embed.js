const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = ['#c84639', '#eeb747', '#8bb149', '#2f5e9e']

module.exports = {
	data: new SlashCommandBuilder()
		.setName("embed")
		.setDescription(
			"Create an embed to get a message out there."
		)
		.addStringOption((option) =>
			option
				.setName("title")
				.setDescription("The title of the embed")
				.setRequired(true)
		)
        .addStringOption((option) =>
			option
				.setName("description")
				.setDescription("The description of the embed")
				.setRequired(true)
		),

	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor(`${colors[Math.floor(Math.random() * colors.length)]}`)
			.setTitle(`${interaction.options.getString("title")}`)
			.setDescription(`${interaction.options.getString("description")}`);

		await interaction.channel.send({
			embeds: [embed],
		});

		await interaction.delete();
	},
};
