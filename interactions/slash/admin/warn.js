const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("warn")
    .setDescription("Example Description."),
    
    async execute(interaction) {
    }
}