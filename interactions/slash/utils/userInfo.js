const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const colors = ['#c84639', '#eeb747', '#8bb149', '#2f5e9e']

module.exports = {
	data: new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription(
			"Get information about a user from their tag."
		)
		.addUserOption((option) =>
			option
			.setName("usertag")
			.setDescription("The users' tag")
			.setRequired(true)
		),

	async execute(interaction) {
		const user = interaction.options.getUser("usertag")
		const guild = interaction.guild
		const member = guild.members.cache.get(user.id)
		const embed = new MessageEmbed()
			.setColor(`${colors[Math.floor(Math.random() * colors.length)]}`)
			.setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
			.addFields(
				{
					name: 'User Tag',
					value: user.tag,
				},
				{
					name: 'Display Name',
					value: member.displayName
				},
				{
					name: 'User ID',
					value: user.id
				},
				{
					name: 'Joined Server On',
					value: new Date(member.joinedTimestamp).toLocaleDateString(),
				},
				{
					name: 'Account Created On',
					value: new Date(user.createdAt).toLocaleDateString()
				}
			)
			await interaction.reply({
				embeds: [embed],
			});			
	},
};
