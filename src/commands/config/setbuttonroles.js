const {SlashCommandBuilder,PermissionFlagsBits} = require("discord.js");
const mysql = require("../../mysqldb/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setbuttonroles")
    .setDescription("Configures the /buttonroles command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option
        .setName("role_button")
        .setDescription("Use 'roleName1:roleName2:...' to generate the buttons corresponding to the roles")
        .setRequired(true)
    ),

    async execute(interaction) {
        // VALIDATING AND PARSING THE ARGUMENTS
        const guildRoles = await interaction.guild.roles.fetch();
        const roles = interaction.options.getString("role_button").split(':');
        if(roles.length == 0) throw new Error("Provided no or malformatted arguments");
        if(roles.length > 25) throw new Error(`Execeeded maximum arguments length ${roles.length}`);

        for(role of roles) {
            if(!guildRoles.find(r => r.name == role)) throw new Error(`No role was found with the name ${role}`);
        }
        
        // STORING THE DATA IN MYSQL DB
        const connection = await mysql.createConnection();
        let rows = await mysql.queryDb("SELECT guild_id FROM btnroles_conf WHERE guild_id=?",connection,[interaction.guildId]);
        if(rows.length == 0) { // no previous configurations exist for this server
            await mysql.queryDb("INSERT INTO btnroles_conf (guild_id,roles) VALUES (?,?)",
                connection,
                [interaction.guildId,JSON.stringify(roles)]);
            await interaction.reply("Configurations for /buttonroles command were registered successfully");
        }
        else {
            await mysql.queryDb("UPDATE btnroles_conf SET roles=? WHERE guild_id=?",
                connection,
                [JSON.stringify(roles),interaction.guildId]);
            await interaction.reply("Configurations for /buttonroles command were updated successfully");
        }
        await mysql.endConnection(connection);
    }
}