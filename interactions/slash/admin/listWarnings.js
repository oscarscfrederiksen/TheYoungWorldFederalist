const { SlashCommandBuilder, time } = require("@discordjs/builders");
const mongoConnection = require("./../../../utils/mongoConnection")
const warnSchema = require("./../../../models/warn")
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("listwarnings")
        .setDescription("Retrieve a list of warnings for a given user.")
        .addUserOption((option) =>
            option
            .setName("user")
            .setDescription("The target user.")
            .setRequired(true)
        ),
    
    async execute(interaction) {
        const fetchWarnings = async () => {
            const guildId = interaction.guild.id
            const warnUser = interaction.options.getUser("user")
            const userId = warnUser.id

            let numberOfWarnings = 0;
            var logDescription;
            let warningList;

            if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.editReply("**You don't have the permission to view warns! - [MANAGE_MEMBERS]**")
            if (!warnUser) return interaction.editReply("**This member doesn't seem to exist...**")

            await mongoConnection().then(async (mongoose) => {
                try {
                    const results = await warnSchema.findOne({
                        guildId,
                        userId,
                    })

                    warningList = `\n`

                    try {
                        for (const warning of results.warnings) {
                            numberOfWarnings += 1
                            const {author, timestamp, reason } = warning
                            warningList += `${numberOfWarnings}. By ${author} on ${timestamp}. ${reason}\n`
                        }
                    } catch {
                        // There are no warnings.
                    }
                } finally {
                    mongoose.connection.close()
                }
            })

            if (numberOfWarnings > 1) {
                logDescription = `${warnUser.username} has been warned ${numberOfWarnings} times.\n${warningList}`
            } else if (numberOfWarnings == 1) {
                logDescription = `${warnUser.username} has been warned ${numberOfWarnings} time.\n${warningList}`
            } else {
                logDescription = `${warnUser.username} has not previously been warned.`
            }

            const logEmbed = new MessageEmbed()
                .setAuthor(`Warning list for ${warnUser.username}`, interaction.guild.iconURL())
                .setColor("#c84639")
                .setThumbnail(warnUser.displayAvatarURL({ dynamic: true }))
                .setDescription(`${logDescription}`)
                .setTimestamp()
            
            return logEmbed
        }
        
        interaction.deferReply()
        const result = await fetchWarnings()
        interaction.editReply({embeds : [result]})
    }
}