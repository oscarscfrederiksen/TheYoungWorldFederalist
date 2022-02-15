const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roleinfo")
        .setDescription("Example Description."),
    
    async execute(interaction) {
    }
}