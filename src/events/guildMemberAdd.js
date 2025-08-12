const {Events, GuildMember , Client} = require('discord.js');
const mysql = require('../database/db.js');
/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */
async function handler(client, member) {
    try {
        let guildId = member.guild.id;
        let [welcomeConfig] = await mysql.execute("SELECT * FROM server_conf WHERE guild_id=?",[guildId]);
        if(welcomeConfig.length > 0) {
            let welcomeChannelId = welcomeConfig[0].welcome_channel;
            let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
            if(!welcomeChannel) {
                welcomeChannel = await member.guild.channels.fetch(welcomeChannelId);
            }
            let welcomeMessage = welcomeConfig[0].welcome_message;
            
            if (welcomeChannel && welcomeChannel.isTextBased()) {
                await welcomeChannel.send(welcomeMessage.replaceAll("@user", `<@${member.id}>`));
            } 
            else {
                console.warn(`Welcome channel not found or not text-based for guild ${guildId}`);
            }
        }
        let [row] = await mysql.execute(`SELECT role_id FROM autorole_conf WHERE guild_id=?`,[guildId]);
        if(row.length != 0) {
            await member.roles.add(String(row[0].role_id));
        }
    } 
    catch(err) {
        console.error("Something went wrong with GuildMemberAdd Event handler");
        console.error(err);
    }
}

module.exports = {
    event: Events.GuildMemberAdd,
    handler
}