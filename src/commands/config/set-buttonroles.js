const {SlashCommandBuilder,PermissionFlagsBits,ChatInputCommandInteraction, InteractionContextType} = require("discord.js");
const mysql = require("../../database/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-buttonroles")
    .setDescription("Configures the /buttonroles command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(option =>
        option
        .setName("role_button")
        .setDescription("Use 'roleName1:roleName2:...' to generate the buttons corresponding to the roles")
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            // VALIDATING AND PARSING THE ARGUMENTS
            const guildRoles = await interaction.guild.roles.fetch();
            const roles = interaction.options.getString("role_button").split(':');
            if(roles.length == 0) throw new Error("Provided no or malformatted arguments");
            if(roles.length > 25) throw new Error(`Execeeded maximum arguments length ${roles.length}`);

            for(role of roles) {
                if(!guildRoles.find(r => r.name == role)) throw new Error(`No role was found with the name ${role}`);
            }
            
            // STORING THE DATA IN MYSQL DB
            let [rows] = await mysql.execute("SELECT guild_id FROM btnroles_conf WHERE guild_id=?",[interaction.guildId]);
            if(rows.length == 0) { // no previous configurations exist for this server
                await mysql.execute("INSERT INTO btnroles_conf (guild_id,roles) VALUES (?,?)",
                    [interaction.guildId,JSON.stringify(roles)]);
                await interaction.reply("Configurations for /buttonroles command were registered successfully");
            }
            else {
                await mysql.execute("UPDATE btnroles_conf SET roles=? WHERE guild_id=?",
                    [JSON.stringify(roles),interaction.guildId]);
                await interaction.reply("Configurations for /buttonroles command were updated successfully");
            }
        }
        catch(err) {
            interaction.reply({
                content: "Something went wrong while executing this command please check that you used the right syntax",
                ephemeral: true
            })
        }
    }
}