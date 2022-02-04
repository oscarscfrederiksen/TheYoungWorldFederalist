const { MessageEmbed } = require("discord.js");
const colors = ['#c84639', '#eeb747', '#8bb149', '#2f5e9e']

exports.run = async (bot, message, args) => {
    let fullArgs = args.join(" ")

    var title = fullArgs.substring(
        fullArgs.split('"', 1).join('"').length + 1,
        fullArgs.split('"', 2).join('"').length
    );

    var description = fullArgs.substring(
        fullArgs.split('"', 3).join('"').length + 1,
        fullArgs.split('"', 4).join('"').length
    );
    
    const embed = new MessageEmbed()
	    .setColor(`${colors[Math.floor(Math.random() * colors.length)]}`)
	    .setTitle(`${title}`)
	    .setDescription(`${description}`)
	    .setTimestamp()
	    .setFooter(`${message.author.username}`);
    
    await message.delete().catch(error => console.log(error))
    message.channel.send({ embeds: [embed] })
}

exports.help = {
    name:"embed"
}