const { GuildBan, Events } = require('discord.js')
const mysql = require("../database/db")

/**
 * 
 * @param {GuildBan} ban 
 */
async function handler(ban) {
    try {
        const userId = ban.user.id;
        const guildId = ban.guild.id;
        let [rows] = await mysql.execute("SELECT * FROM tempbans WHERE guild_id=? AND user_id=?",[String(guildId),String(userId)]);
        if(rows.length > 0) {
            await mysql.execute("DELETE FROM tempbans WHERE guild_id=? AND user_id=?",[String(guildId),String(userId)]);
        }
    }
    catch(err) {
        console.error("Something went wrong with GuildBanRemove Event handler")
        console.error(err)
    }
}

module.exports = {
    event: Events.GuildBanRemove,
    handler
}