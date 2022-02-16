const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
    .setDescription(
      "Bulk delete a number of messages in a channel."
    )
    .addIntegerOption(option =>
      option
      .setName("number")
      .setDescription("The number of messages you want to delete.")
      .setRequired(true)
    ),
    
    async execute(interaction) {
      process.on('unhandledRejection', (error) => {
        interaction.reply(`${error.toString().replace("DiscordAPIError: ", "")}`)
      });
      const numberOfMessages = interaction.options.getInteger("number")
      if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply("**You do not have the permissions required for this command! - [MANAGE_MESSAGES]**")
      if (numberOfMessages < 1 || numberOfMessages > 100) return interaction.reply("**Please supply a number of messages between 1 and 100.**")
      interaction.channel.bulkDelete(numberOfMessages).then(messages => interaction.reply(`**Successfully deleted \`${messages.size}/${numberOfMessages}\` messages**`))
    }
}