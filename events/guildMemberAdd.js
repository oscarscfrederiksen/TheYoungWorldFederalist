const {serverID} = require("../config.json");

module.exports = {
    name: 'guildMemberAdd',
    execute(member, bot) {
        userNumber = bot.guilds.cache.get(serverID).memberCount
        console.log('User ' + member.user.username + ' has joined the server!');
        member.guild.channels.cache.find(c => c.name === "welcome").send(`Hello <@${member.user.id}>, glad you found us!\nYou are our ${ordinal(userNumber)} member :partying_face:\n\n **Answer these three questions in #Introductions:**\n:round_pushpin: Where are you from? (to put you in contact with your local section)\n:mag_right: How did you find the server?\n:globe_with_meridians: Have you heard of world federalism? If so, what do you think?`)
    }
}

const ordinal = (number) => {
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