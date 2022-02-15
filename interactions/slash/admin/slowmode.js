const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("slowmode")
    .setDescription(
        "Set the slowmode of a channel (defaults to message channel)."
    )
    .addIntegerOption(option =>
      option
      .setName("seconds")
      .setDescription("The number of seconds between messages.")
      .setRequired(true)
    )
    .addChannelOption(option =>
        option
        .setName("channel")
        .setDescription("The channel you want to set the slowmode for (defaults to message channel).")
        .setRequired(false)
    ),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply("**You do not have the permissions required for this command! - [MANAGE_MESSAGES]**")
        const channel = interaction.options.getChannel("channel") || interaction.channel
        const seconds = interaction.options.getInteger("seconds")
        await channel.setRateLimitPerUser(seconds)
        interaction.reply(
            `Successfully set the slowmode of <#${channel.id}> to ${seconds} seconds.`
        )
    }
}