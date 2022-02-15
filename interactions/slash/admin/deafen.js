const { SlashCommandBuilder } = require("@discordjs/builders");
const { test_guild_id } = require("./../../../config.json").meta

module.exports = {
	data: new SlashCommandBuilder()
		.setName("deafen")
    .setDescription("Deafens a user in a voice channel.")
    .addUserOption(option =>
      option
      .setName("user")
      .description("The user to be deafened.")
      .setRequired(true)
    )
    .addStringOption(option =>
      option
      .setName("reason")
      .setDescription("The reason for deafening the user.")
      .setRequired(false)
    ),
    
    async execute(interaction) {
      const guild = interaction.client.guilds.cache.get(test_guild_id)
      const deafenedUser = interaction.options.getUser("user")
      const deafenedMember = guild.members.cache.get(deafenedUser.id) || await guild.members.fetch(deafenedUser.id)
      const deafenedReason = interaction.options.getString("reason") !== null ? `The reason provided was: ${interaction.options.getString("reason")}` : "No reason was provided by the moderators."

      if (!interaction.member.permissions.has("DEAFEN_MEMBERS")) return interaction.reply("**You don't have the permission to deafen users! - [DEAFEN_MEMBERS]**")
      if (!member) return interaction.reply("**This user seems not to exist...**")

      const logEmbed = new MessageEmbed()
        .setAuthor("YWF Moderation logs", interaction.guild.iconURL())
        .setColor("#c84639")
        .setThumbnail(deafenedMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
              name: "**Moderation**",
              value: "Deafen"
          },
          {
              name: "**Deafened**",
              value: deafenedMember.user.username
          },
          {
              name: "**ID**",
              value: deafenedMember.id
          },
          {
              name: "**Deafened By**",
              value: interaction.member.user.username
          },
          {
              name: "**Reason**",
              value: deafenedReason
          },
          {
              name: "**Date**",
              value: interaction.createdAt.toLocaleString()
          }
      )
      .setTimestamp()
  
  interaction.guild.channels.cache.get(moderation_logs).send(
      { embeds : [logEmbed] }
  )

      deafenedMember.voice.setDeaf(true, deafenedReason)
      interaction.reply(`${deafenedUser.username} was successfully deafened.`)
    }
}