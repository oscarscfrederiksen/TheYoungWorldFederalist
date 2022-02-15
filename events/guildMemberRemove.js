const { updateMemberChannel } = require("./../utils/helperFunctions")

module.exports = {
    name: 'guildMemberRemove',

    execute(member) {
        updateMemberChannel(member.guild)
    },
};