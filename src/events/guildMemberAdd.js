const {Events} = require('discord.js');

async function handler(client, member) {
    try {
        let guildId = member.guild.id;
        if(client.welcomes.has(guildId)) {
            let welcomeConf = client.welcomes.get(guildId);
            let welcomeChannelId = welcomeConf.welcome_channel;
            let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
            if(!welcomeChannel) {
                welcomeChannel = await member.guild.channels.fetch(welcomeChannelId);
            }
            let welcomeMessage = welcomeConf.welcome_message;
            
            if (welcomeChannel && welcomeChannel.isTextBased()) {
                await welcomeChannel.send(welcomeMessage.replaceAll("@user", `<@${member.id}>`));
            } 
            else {
                console.warn(`Welcome channel not found or not text-based for guild ${guildId}`);
            }
        }
    } catch(err) {
        console.error("Something went wrong with GuildMemberAdd Event handler");
        console.error(err);
    }
}

module.exports = {
    event: Events.GuildMemberAdd,
    handler
}