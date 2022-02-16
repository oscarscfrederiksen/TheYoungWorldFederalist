const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoConnection = require("./../../../utils/mongoConnection")
const warnSchema = require("./../../../models/warn")
const { MessageEmbed } = require("discord.js");
const { test_guild_id } = require("./../../../config.json").meta
const { moderation_logs } = require("./../../../config.json").channels

module.exports = {
	data: new SlashCommandBuilder()
		.setName("warn")
    .setDescription("Warn a user for an action.")
    .addUserOption((option) =>
      option
      .setName("user")
      .setDescription("The target user.")
      .setRequired(true)
    )
    .addStringOption((option) => 
      option
      .setName("reason")
      .setDescription("The reason for warning the user")
      .setRequired(false)
    )
    .addIntegerOption((option) =>
            option
            .setName("timeout")
            .setDescription("Optionally restrict the user from messaging for a number of minutes.")
            .setRequired(false)
    ),
    
    async execute(interaction) {
      const guild = interaction.client.guilds.cache.get(test_guild_id)
      const guildId = test_guild_id

      const warnUser = interaction.options.getUser("user")
      const warnMember = guild.members.cache.get(warnUser.id) || await guild.members.fetch(warnUser.id).catch(err => {console.log(err)})
      const userId = warnUser.id

      const warnReason = interaction.options.getString("reason") !== null ? `The reason provided was: ${interaction.options.getString("reason")}` : "No reason was provided by the moderators."

      if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply("**You don't have the permission to warn users! - [KICK_MEMBERS]**")
      if (interaction.member == warnMember) return interaction.reply("**You cannot warn yourself.**")
      if (!warnMember) return interaction.reply("**This member doesn't seem to exist...**")
      if (interaction.member.roles.highest.position <= warnMember.roles.highest.position) return interaction.reply("**You cannot warn members with a higher role than you.**")

      await warnUser.send(`You have been warned in the YWF discord server. ${warnReason}`).catch(err => {console.log(err)})

      const warning = {
        author: interaction.member.user.tag,
        timestamp: new Date().toLocaleDateString(),
        reason: warnReason,
      }

      await mongoConnection().then(async (mongoose) => {
        try {
          await warnSchema.findOneAndUpdate(
            {
              guildId,
              userId,
            },
            {
              guildId,
              userId,
              $push: {
                warnings: warning,
              },
            },
            {
              upsert: true,
            }
          )
        } finally {
          mongoose.connection.close()
        }
      })

      const logEmbed = new MessageEmbed()
        .setAuthor("YWF Moderation logs", interaction.guild.iconURL())
        .setColor("#c84639")
        .setThumbnail(warnMember.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
              name: "**Moderation**",
              value: "Warn"
          },
          {
              name: "**Warned**",
              value: warnMember.user.username
          },
          {
              name: "**ID**",
              value: warnUser.id
          },
          {
              name: "**Warned By**",
              value: interaction.member.user.username
          },
          {
              name: "**Reason**",
              value: warnReason
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

  interaction.reply(`${warnUser.username} was warned successfully.`)

  const minutes = interaction.options.getInteger("minutes")

  if(minutes !== null) {
    await warnMember.timeout(minutes * 60 * 1000, warnReason).then(console.log, console.error)
  }

  }
}