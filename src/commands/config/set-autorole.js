const {SlashCommandBuilder,PermissionFlagsBits,ChatInputCommandInteraction, InteractionContextType} = require('discord.js')
const mysql = require('../../database/db.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-autorole")
    .setDescription("Configures the autorole property")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addRoleOption(option => 
        option
        .setName("role")
        .setDescription("The role that should be automatically given for when a user joins")
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                await interaction.reply({content: "Missing Administrator permissions to execute this command"})
                return 
            }

            const roleId = String(interaction.options.getRole("role").id);
            const guildId = String(interaction.guildId);
            
            let [row] = await mysql.execute(`SELECT * FROM autorole_conf WHERE guild_id=?`,[guildId])
            if(row.length == 0) {
                await mysql.execute(`INSERT INTO autorole_conf VALUES (?,?)`,[guildId,roleId])
                await interaction.reply(`Autorole was configured successfully for <@&${roleId}> use \`/set-disable-autorole\` to disable it`)
            } 
            else {
                if(row[0].role_id == roleId) {
                    await interaction.reply(`Autorole was already configured to role <@&${roleId}>`)
                    return
                }
                await mysql.execute(`UPDATE autorole_conf SET role_id=? WHERE guild_id=?`,[roleId,guildId])
                await interaction.reply(`Autorole was updated successfully for <@&${roleId}> use \`/set-disable-autorole\` to disable it`)
            }
        }
        catch(err) {
            interaction.reply({
                content: "something went wrong while executing this command",
                ephemeral: true
            })
            console.error(err)
        }
    }
}