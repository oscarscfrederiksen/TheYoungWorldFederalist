const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = ['#c84639', '#eeb747', '#8bb149', '#2f5e9e']

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"List all commands of bot or info about a specific command."
		),

	async execute(interaction) {
		const commands = interaction.client.slashCommands;
		const helpEmbed = new MessageEmbed()
			.setColor(`${colors[Math.floor(Math.random() * colors.length)]}`)
			.setTitle("Here's everything I can do: ")
			.setDescription(
				`${commands.map((command) => `**${command.data.name.charAt(0).toUpperCase() + command.data.name.slice(1)}** : ${command.data.description}`).join("\n")}`
			);

		await interaction.reply({
			embeds: [helpEmbed],
		});
	},
};
