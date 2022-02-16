const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js")
const colors = ['#c84639', '#eeb747', '#8bb149', '#2f5e9e']

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roleinfo")
        .setDescription("Get information about a given role.")
        .addStringOption((option) =>
            option
            .setName("name")
            .setDescription("The name of the role.")
            .setRequired(true)
        ),
    
    async execute(interaction) {
        try {
            const role = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === interaction.options.getString("name").toLowerCase())
            const perms = new Permissions(role.permissions.bitfield).toArray()
            const info = new MessageEmbed()
                .setColor(`${colors[Math.floor(Math.random() * colors.length)]}`)
                .setTitle(`Information on ${role.name}`)
                .addFields(
                    {
                        name: 'Role ID: ',
                        value: role.id,
                        inline: true,
                    },
                    {
                        name: 'Role Name: ',
                        value: role.name,
                        inline: true,
                    },
                    {
                        name: 'Mentionable: ',
                        value: role.mentionable ? 'Yes' : 'No',
                        inline: true,
                    },
                    {
                        name: 'Role Permissions: ',
                        value: perms.join(', '),
                    }
                )
            interaction.reply(
                { embeds: [info] }
            )
        } catch (error) {
            return interaction.reply("The role doesn't seem to exist.").then(() => console.log(error))
        }
    }
}