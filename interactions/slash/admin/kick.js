const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { moderation_logs } = require("./../../../config.json").channels

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription(
			"Kick a user."
		)
		.addUserOption((option) =>
			option
			.setName("user")
			.setDescription("The users' tag.")
			.setRequired(true)
		)
        .addStringOption((option) =>
            option
            .setName("reason")
            .setDescription("The reason for the kick.")
            .setRequired(false)
        ),
    
    async execute(interaction) {
        const guild = interaction.guild

        const kickUser = interaction.options.getUser("user")
		    const kickMember = guild.members.cache.get(kickUser.id) || await guild.members.fetch(kickUser.id).catch(err => {console.log(err)})

        const kickReason = interaction.options.getString("reason") !== null ? `The reason provided was: ${interaction.options.getString("reason")}` : "No reason was provided by the moderators."

        if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply("**You don't have the permission to kick users! - [KICK_MEMBERS]**")
        if (interaction.member == banMember) return interaction.reply("**You cannot kick yourself.**")
        if (!kickMember) return interaction.reply("**This member doesn't seem to exist...**")
        if (!kickMember.bannable) return interaction.reply("**This user cannot be kicked.**")
        if (interaction.member.roles.highest.position <= kickMember.roles.highest.position) return interaction.reply("**You cannot ban members with a higher role than you.**")

        await kickUser.send(`You have been banned from the YWF discord server. ${kickReason}`).catch(err => console.log(err))
        await kickMember.ban({ kickReason })

        const logEmbed = new MessageEmbed()
            .setAuthor("YWF Moderation logs", interaction.guild.iconURL())
            .setColor("#c84639")
            .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "**Moderation**",
                    value: "Kick"
                },
                {
                    name: "**Kicked**",
                    value: kickMember.user.username
                },
                {
                    name: "**ID**",
                    value: kickMember.id
                },
                {
                    name: "**Banned By**",
                    value: interaction.member.user.username
                },
                {
                    name: "**Reason**",
                    value: kickReason
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

        interaction.reply(`${kickUser.username} was kicked successfully.`)
    }
}