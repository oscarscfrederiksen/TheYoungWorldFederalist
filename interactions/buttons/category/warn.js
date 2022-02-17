const mongoConnection = require("./../../../utils/mongoConnection")
const warnSchema = require("./../../../models/warn")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { moderation_logs } = require("./../../../config.json").channels

module.exports = {
	id: "warn",

	async execute(interaction) {
		const interactionDescription = interaction.message.embeds[0].description.toString()
		const userId = interactionDescription.substring(
			interactionDescription.indexOf("<@") + 2,
			interactionDescription.lastIndexOf(">")

		)

		const guild = interaction.member.guild
		const guildId = guild.id
      	const warnMember = guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(err => {console.log(err)})
		const warnReason = `The reason provided was: Use of a racial slur.`

		if (!warnMember) return interaction.reply("**This member doesn't seem to exist...**")
      	if (interaction.member.roles.highest.position < warnMember.roles.highest.position) return interaction.reply("**You cannot warn members with a higher role than you.**")
		
		await warnMember.user.send(`You have been warned in the YWF discord server. ${warnReason}`).catch(err => {console.log(err)})

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
              		value: warnMember.user.id
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

  		// interaction.reply(`${warnMember.user.username} was warned successfully.`)
		
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
		updatedEmbed.setColor("#eeb747")
		updatedEmbed.setTitle(`${interaction.message.embeds[0].title} (Resolved: Warned)`)
		await interaction.message.edit({
			embeds: [updatedEmbed],
			components : [updatedRow]
		});
		interaction.deferUpdate()
	},
};
