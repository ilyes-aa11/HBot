const {SlashCommandBuilder, ChannelType, PermissionFlagsBits, InteractionContextType} = require("discord.js");
const mysql = require("../../database/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-welcome")
    .setDescription("Configures welcome message and welcome channel ")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(option => 
        option.setName("message")
        .setDescription("Message to be sent when new member joins in use '@user' to reference the user")
        .setRequired(true)
        .setMaxLength(255)
    )
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Channel to send the welcome messages into")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

    async execute(interaction) {
        let msg = interaction.options.getString("message");
        let channel_id = interaction.options.getChannel("channel").id;
        let guild_id = interaction.guild.id;
        
        let sql_query = "SELECT welcome_channel,welcome_message FROM server_conf WHERE guild_id=?";
        let [res] = await mysql.execute(sql_query,[guild_id]);
        if(res.length == 0) { // no previous configuration for this server
            sql_query = "INSERT INTO server_conf (guild_id,welcome_channel,welcome_message) VALUES (?,?,?)";
            await mysql.execute(sql_query,[guild_id,channel_id,msg]);
        }
        else { // previous configuration exists we just update them
            sql_query = "UPDATE server_conf SET welcome_channel=? , welcome_message=? WHERE guild_id=?";
            await mysql.execute(sql_query,[channel_id,msg,guild_id]);
        }
        await interaction.reply("Welcome configs registered successfully");
    }
}