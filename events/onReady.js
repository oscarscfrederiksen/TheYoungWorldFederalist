const {test_guild_id} = require("./../config.json")

module.exports = {
	name: "ready",
	once: true,

	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [{ name: 'Campaigning for a world federation.'}] });
		(function(){
			let date = new Date()
			const channelID = "939922039484084224"
			client.channels.fetch(channelID).then(timeChannel => timeChannel.setName(`UTC: ${( '0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}`))
			console.log(`UTC: ${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}`)
			setTimeout(arguments.callee, 60000)
		})();
	},
};