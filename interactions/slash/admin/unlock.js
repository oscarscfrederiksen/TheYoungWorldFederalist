const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unlock")
    .setDescription(
      "Unlock a channel."
    ),
    
    async execute(interaction) { 
        if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.followUp( { content: "**You don't have the permission to lock channels! - [MANAGE_GUILD]**", ephemeral: true})
        interaction.guild.roles.cache.forEach(role => {
          interaction.channel.permissionOverwrites.create(role, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
          })
        })
        interaction.reply(`Done | Channel Unlocked!`)
    }
}