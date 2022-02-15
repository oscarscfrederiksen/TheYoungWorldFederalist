const { member_count } = require("./../config.json").channels

module.exports = {
    updateMemberChannel(guild) {
        const channel = guild.channels.cache.get(member_count)
        channel.setName(`Member Count: ${(guild.memberCount-1).toLocaleString()}`)
    },

    addSuffix(number) {
        const ordinalRules = new Intl.PluralRules("en", {
          type: "ordinal"
        });
        const suffixes = {
          one: "st",
          two: "nd",
          few: "rd",
          other: "th"
        };
        const suffix = suffixes[ordinalRules.select(number)];
        return (number + suffix);
    }
}