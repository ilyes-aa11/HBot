const {SlashCommandBuilder,PermissionFlagsBits,ChatInputCommandInteraction,MessageFlags, InteractionContextType, Client, Guild} = require('discord.js');
const mysql = require("../../database/db.js")

/**
 * 
 * @param {string} duration 
 * @returns {number}
 * receives a string in the format XyXmXd and returns the its value in milliseconds
 */
function evalDuration(duration) {
    const dayMs = 24 * 60 * 60 * 1000; 
    const monthMs = 30 * dayMs;        
    const yearMs = 365 * dayMs;        

    let years , months , days;
    if(duration.includes("y")) {
        [years,duration] = duration.split("y");
        years = Number(years);
        if(Number.isNaN(years)) throw new Error("Invalid arguments provided to duration in tempban.js command")
    }
    if(duration.includes("m")) {
        [months,duration] = duration.split("m");
        months = Number(months);
        if(Number.isNaN(months)) throw new Error("Invalid arguments provided to duration in tempban.js command")
    }
    if(duration.includes("d")) {
        [days,duration] = duration.split("d")
        days = Number(days);
        if(Number.isNaN(days)) throw new Error("Invalid arguments provided to duration in tempban.js command")
    }
    let ms = 0;
    ms += (years) ? years*yearMs:0;
    ms += (months) ? months*monthMs:0;
    ms += (days) ? days*dayMs:0;

    return ms;
}


module.exports = {
    data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Bans a user for specific period of time")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("Target user to be banned")
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName("duration")
        .setDescription("The duration of the ban use this strict format 'XyXXmXXd' default = 7d")
    )
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("Reason for banning this user")
    )
    .addBooleanOption(option =>
        option
        .setName("delete-messages")
        .setDescription("Determines whether deletes the user messages after banning")
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            interaction.reply({content: "Missing Ban member permission to perform this action",flags: MessageFlags.Ephemeral});
            return;
        }
        let member = interaction.options.getMember("user");
        let duration = interaction.options.getString('duration') || "7d";
        let banReason = interaction.options.getString("reason") || "";
        let delMessages = interaction.options.getBoolean("delete-messages") || false;
        let durationMs = evalDuration(duration);
        let expireTime = Date.now() + durationMs;
        await mysql.execute("INSERT INTO tempbans (guild_id,user_id,expire_date) VALUES (?,?,?)",[String(interaction.guildId),String(member.user.id),expireTime]);
        await member.ban({
            deleteMessageSeconds: (delMessages) ? 604800:0,
            reason: banReason
        });
        setTimeout(() => this.removeBan(interaction.guild,member.id),durationMs);
        interaction.reply(`User <@${member.id}> has been banned until ${new Date(expireTime).toISOString().split("T")[0]}`);
    },
    /**
     * 
     * @param {Guild} guild 
     * @param {Snowflake} userId 
     */
    async removeBan(guild,userId) {
        try {
            await guild.bans.remove(userId);
            await mysql.execute("DELETE FROM tempbans WHERE guild_id=? AND user_id=?",[String(guild.id),String(userId)]);
        }
        catch(err) {
            console.error(`failed to remove a ban from \nguild_id:${guild.id}\nuser_id:${userId}`);
            console.error(err)
        }
    }
    ,
    /**
     * 
     * @param {Client} client 
     */
    async readTempBans(client) {
        try {
            const [rows] = await mysql.execute("SELECT * FROM tempbans")
    
            for(const record of rows) {
                let guild = client.guilds.cache.get(record.guild_id);
                if(!guild) {
                    try {
                        guild = await client.guilds.fetch(record.guild_id);
                    }
                    catch(err) { // means the guild is no longer in the list of guilds of the bot
                        mysql.execute("DELETE FROM tempbans WHERE guild_id=?",[record.guild_id]);
                        continue;
                    }
                } 
                let ban = guild.bans.cache.get(record.user_id);
                if(!ban) {
                    try {
                        ban = await guild.bans.fetch(record.user_id);
                    }
                    catch(err) {
                        mysql.execute("DELETE FROM tempbans WHERE (guild_id,user_id)=(?,?)",[guild.id,record.user_id]);
                        continue;
                    }
                }
                if(record.expire_date <= Date.now()) {
                    guild.bans.remove(record.user_id)
                    .then(() => mysql.execute("DELETE FROM tempbans WHERE guild_id=? AND user_id=?",[String(guild.id),record.user_id]))
                    .catch(err => {
                        console.error(`failed to remove a ban from \nguild_id:${guild.id}\nuser_id:${record.user_id}`);
                        console.error(err);
                    })
                }
                else {
                    setTimeout(() => this.removeBan(guild,record.user_id), record.expire_date - Date.now());
                }
            }
        }
        catch(err) {
            console.error("Something went wrong while reading tempbans and registering them")
            console.error(err)
        }
    }
}

