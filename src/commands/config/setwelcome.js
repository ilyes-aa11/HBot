const {SlashCommandBuilder} = require("discord.js");
const mysql = require("../../mysqldb/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription("Configures welcome message and welcome channel ")
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
    ),

    async execute(interaction) {
        let msg = interaction.options.getString("message");
        let channel_id = interaction.options.getChannel("channel").id;
        let guild_id = interaction.guild.id;
        
        let connection = await mysql.createConnection();
        let sql_query = "SELECT welcome_channel,welcome_message FROM server_conf WHERE guild_id=?";
        let res = await mysql.queryDb(sql_query,connection,[guild_id]);
        if(res.length == 0) { // no previous configuration for this server
            sql_query = "INSERT INTO server_conf (guild_id,welcome_channel,welcome_message) VALUES (?,?,?)";
            await mysql.queryDb(sql_query,connection,[guild_id,channel_id,msg]);
        }
        else { // previous configuration exists we just update them
            sql_query = "UPDATE server_conf SET welcome_channel=? , welcome_message=? WHERE guild_id=?";
            await mysql.queryDb(sql_query,connection,[channel_id,msg,guild_id]);
        }
        mysql.endConnection(connection);
        await interaction.reply("Welcome configs registered successfully");
    }
}