function updateMembers(guild) {
    const channelID = "900650877776445474"
    const channel = guild.channels.cache.get(channelID)
    channel.setName(`Member Count: ${guild.memberCount.toLocaleString()}`)
}