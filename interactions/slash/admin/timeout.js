const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const { moderation_logs } = require("./../../../config.json").channels

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription(
			"Times out a user."
		)
		.addUserOption((option) =>
			option
			.setName("user")
			.setDescription("The users' tag.")
			.setRequired(true)
		)
        .addIntegerOption((option) =>
            option
            .setName("minutes")
            .setDescription("The number of minutes for the timeout")
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName("reason")
            .setDescription("The reason for the timeout.")
            .setRequired(false)
        )
        ,
    
    async execute(interaction) {
        const guild = interaction.guild

        const timeoutUser = interaction.options.getUser("user")
		const timeoutMember = guild.members.cache.get(timeoutUser.id) || await guild.members.fetch(timeoutUser.id).catch(err => {console.log(err)})
        const timeoutReason = interaction.options.getString("reason") !== null ? `The reason provided was: ${interaction.options.getString("reason")}` : "No reason was provided by the moderators."

        const minutes = interaction.options.getInteger("minutes")

        if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply("**You don't have the permission to timeout users! - [KICK_MEMBERS]**")
        if (interaction.member == timeoutMember) return interaction.reply("**You cannot time yourself out.**")
        if (!timeoutMember) return interaction.reply("**This member doesn't seem to exist...**")
        if (interaction.member.roles.highest.position <= timeoutMember.roles.highest.position) return interaction.reply("**You cannot timeout members with a higher role than you.**")

        await timeoutMember.send(`You have been timed out from the YWF discord server for ${minutes} minutes. ${timeoutReason}`).catch(err => {console.log(err)})
        await timeoutMember.timeout(minutes * 60 * 1000, timeoutReason).then(console.log, console.error)

        const logEmbed = new MessageEmbed()
            .setAuthor("YWF Moderation logs", interaction.guild.iconURL())
            .setColor("#c84639")
            .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "**Moderation**",
                    value: "Timeout"
                },
                {
                    name: "**Timed Out**",
                    value: timeoutMember.user.username
                },
                {
                    name: "**ID**",
                    value: timeoutMember.id
                },
                {
                    name: "**Timed Out By**",
                    value: interaction.member.user.username
                },
                {
                    name: "**Reason**",
                    value: timeoutReason
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

        interaction.reply(`${timeoutUser.username} was timed out successfully.`)
    }
}