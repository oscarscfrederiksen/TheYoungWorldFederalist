const shortGreetings = ["Hello", "Hey", "Howdy", "Hello there", "Hey there", "Hej", "Bonjour", "Hi", "Greetings", "Welcome", "Hola", "Ciao", "Hallo", "Olá", "Siemano", "Merhaba", "Goededag", "Salve", "Szervusvz", "Terve", "Ahoj"]
const longGreetings = ["glad you found us", "nice to meet you", "happy you are here", "thanks for joining", "great to have you here"]
const { updateMemberChannel, addSuffix } = require("./../utils/helperFunctions")
const { introductions, welcome } = require("./../config.json").channels

module.exports = {
    name: 'guildMemberAdd',

    execute(member, client) {
        updateMemberChannel(member.guild)
        userNumber = member.guild.memberCount - 1
        member.guild.channels.cache.find(welcomeChannel => welcomeChannel.id === welcome).send(
          `${shortGreetings[Math.floor(Math.random() * shortGreetings.length)]} <@${member.user.id}>, ${longGreetings[Math.floor(Math.random() * longGreetings.length)]}!\nYou are our ${addSuffix(userNumber)} member :partying_face:\n\n**Answer these three questions in <#${introductions}>:**\n:round_pushpin: Where are you from? (to put you in contact with your local section)\n:mag_right: How did you find the server?\n:globe_with_meridians: Have you heard of world federalism? If so, what do you think?`)
    },
};