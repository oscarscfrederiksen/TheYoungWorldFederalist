module.exports = {
    name: 'guildMemberRemove',

    execute(member, client) {
        updateMembers(member.guild)
        console.log("User left...")
    },
};

function updateMembers(guild) {
  const channelID = "900650877776445474"
  const channel = guild.channels.cache.get(channelID)
  channel.setName(`Member Count: ${(guild.memberCount-1).toLocaleString()}`)
}