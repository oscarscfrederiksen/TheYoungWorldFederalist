const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lock")
    .setDescription(
      "Lock a channel."
    ),
    
    async execute(interaction) { 
        if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply("**You don't have the permission to lock channels! - [MANAGE_GUILD]**")
        interaction.guild.roles.cache.forEach(role => {
          interaction.channel.permissionOverwrites.create(role, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
        })
        interaction.reply(`Done | Channel Locked!`)
    }
}