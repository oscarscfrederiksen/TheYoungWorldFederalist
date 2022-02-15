const { Collection, MessageEmbed } = require("discord.js");
const fs = require('fs');
const { parse } = require('csv-parse');
const { prefix, owner }= require("./../config.json").meta

var slurs = []
var completeInformation = []
fs.createReadStream(__dirname + '/../data/slurs.csv')
  .pipe(parse())
  .on('data', (row) => {
	if (row[0] != "searchSlur") {
		slurs.push(row[0])
		completeInformation.push([row[0], row[1], row[2], row[3]])
	}
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });


// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
	name: "messageCreate",

	async execute(message) {
		// Declares const to be used.

		const { client, guild, channel, content, author } = message;
		let slur;

		var slurPresent = slurs.some(searchSlur => {
  			slur = searchSlur;
  			return content.toLowerCase().replace(/ /g, "").includes(slur)
		})

		if (slurPresent) {
			let additionalInformation = completeInformation[slurs.indexOf(slur)]

			const embed = new MessageEmbed()
				.setColor('#c84639')
				.setTitle('Message removed. Slur detected.')
				.setDescription("We detected the word **" + additionalInformation[1][0].toLowerCase() + "•".repeat(additionalInformation[1].length - 2) + additionalInformation[1].slice(-1) + "** in your message. To ensure the safety of everyone in the YWF community, we've referred the message to the moderators to decide what to do next.")
				.setFooter('Stopping hate speech is our number one priority, but we know it can be annoying to have your message removed for no reason. Let us know on how we can improve this in #Suggestions.')
		


			const moderationEmbed = new MessageEmbed()
				.setColor('#c84639')
				.setTitle(`Slur detected in ${message.channel.name}`)
				.setDescription(`Slur detected: ${additionalInformation[1]}\n Offensive to: ${additionalInformation[2]}\n Offensive because: ${additionalInformation[3]}\n\n Used by: <@${author.id}>\n Whole message: ${content}`)
				.setTimestamp()
		
			message.guild.channels.cache.find(c => c.name === "moderation").send({
				embeds: [moderationEmbed],
			})

			message.reply({
				embeds: [embed],
			}).then(() => {
				message.delete()
			});
		}

		// Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
		// You can change the behavior as per your liking at ./messages/onMention.js

		if (
			message.content == `<@${client.user.id}>` ||
			message.content == `<@!${client.user.id}>`
		) {
			require("../messages/onMention").execute(message);
			return;
		}

		const checkPrefix = prefix.toLowerCase();

		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`
		);

		// Checks if message content in lower case starts with bot's mention.

		if (!prefixRegex.test(content.toLowerCase())) return;

		const [matchedPrefix] = content.toLowerCase().match(prefixRegex);

		const args = content.slice(matchedPrefix.length).trim().split(/ +/);

		const commandName = args.shift().toLowerCase();

		// Check if mesage does not starts with prefix, or message author is bot. If yes, return.

		if (!message.content.startsWith(matchedPrefix) || message.author.bot)
			return;

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		// It it's not a command, return :)

		if (!command) return;

		// Owner Only Property, add in your command properties if true.

		if (command.ownerOnly && message.author.id !== owner) {
			return message.reply({ content: "This is a owner only command!" });
		}

		// Guild Only Property, add in your command properties if true.

		if (command.guildOnly && message.channel.type === "dm") {
			return message.reply({
				content: "I can't execute that command inside DMs!",
			});
		}

		// Author perms property

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply({ content: "You can not do this!" });
			}
		}

		// Args missing

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send({ content: reply });
		}

		// Cooldowns

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply({
					content: `please wait ${timeLeft.toFixed(
						1
					)} more second(s) before reusing the \`${command.name}\` command.`,
				});
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Rest your creativity is below.

		// execute the final command. Put everything above this.
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply({
				content: "There was an error trying to execute that command!",
			});
		}
	},
};
