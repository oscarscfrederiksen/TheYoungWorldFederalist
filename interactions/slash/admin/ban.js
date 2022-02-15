const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { test_guild_id } = require("./../../../config.json").meta
const { moderation_logs } = require("./../../../config.json").channels

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription(
			"Ban a user."
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
            .setDescription("The reason for the ban.")
            .setRequired(false)
        ),
    
    async execute(interaction) {
        const guild = interaction.client.guilds.cache.get(test_guild_id)

        const banUser = interaction.options.getUser("user")
		const banMember = guild.members.cache.get(banUser.id) || await guild.members.fetch(banUser.id).catch(err => {console.log(err)})

        const banReason = interaction.options.getString("reason") !== null ? `The reason provided was: ${interaction.options.getString("reason")}` : "No reason was provided by the moderators."

        if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply("**You don't have the permission to ban users! - [BAN_MEMBERS]**")
        if (interaction.member == banMember) return interaction.reply("**You cannot ban yourself.**")
        if (!banMember) return interaction.reply("**This member doesn't seem to exist...**")
        if (!banMember.bannable) return interaction.reply("**This user cannot be banned.**")
        if (interaction.member.roles.highest.position <= banMember.roles.highest.position) return interaction.reply("**You cannot ban members with a higher role than you.**")

        await banUser.send(`You have been banned from the YWF discord server. ${banReason}`).catch(err => {console.log(err)})
        await banMember.ban({ banReason })

        const logEmbed = new MessageEmbed()
            .setAuthor("YWF Moderation logs", interaction.guild.iconURL())
            .setColor("#c84639")
            .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "**Moderation**",
                    value: "Ban"
                },
                {
                    name: "**Banned**",
                    value: banMember.user.username
                },
                {
                    name: "**ID**",
                    value: banMember.id
                },
                {
                    name: "**Banned By**",
                    value: interaction.member.user.username
                },
                {
                    name: "**Reason**",
                    value: banReason
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

        interaction.reply(`${banUser.username} was banned successfully.`)
    }
}