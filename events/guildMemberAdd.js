const {test_guild_id} = require("../config.json")
const shortGreetings = ["Hello", "Hey", "Howdy", "Hello there", "Hey there", "Hej", "Bonjour", "Hi", "Greetings", "Welcome", "Hola", "Ciao", "Hallo", "Olá", "Siemano", "Merhaba", "Goededag", "Salve", "Szervusvz", "Terve", "Ahoj"]
const longGreetings = ["glad you found us", "nice to meet you", "happy you are here", "thanks for joining", "great to have you here", ""]

module.exports = {
    name: 'guildMemberAdd',

    execute(member, client) {
        userNumber = client.guilds.cache.get(test_guild_id).memberCount - 1
        console.log('User ' + member.user.username + ' has joined the server!');
        member.guild.channels.cache.find(c => c.name === "welcome").send(`${shortGreetings[Math.floor(Math.random() * shortGreetings.length)]} <@${member.user.id}>, ${longGreetings[Math.floor(Math.random() * longGreetings.length)]}!\nYou are our ${ordinal(userNumber)} member :partying_face:\n\n **Answer these three questions in #Introductions:**\n:round_pushpin: Where are you from? (to put you in contact with your local section)\n:mag_right: How did you find the server?\n:globe_with_meridians: Have you heard of world federalism? If so, what do you think?`)
    },
};

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