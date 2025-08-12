const {SlashCommandBuilder,PermissionFlagsBits,ChatInputCommandInteraction, InteractionContextType} = require('discord.js')
const mysql = require('../../database/db.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-disable-autorole")
    .setDescription("Disables the autorole property")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            let [result] = await mysql.execute("SELECT * FROM autorole_conf WHERE guild_id=?",[String(interaction.guildId)]);
            if(result.length == 0) {
                await interaction.reply("Autorole is not configured yet");
            }
            else {
                await mysql.execute("DELETE FROM autorole_conf WHERE guild_id=?",[String(interaction.guildId)]);
                await interaction.reply("Autorole has been disabled to configure it again use `/set-autorole`");
            }
        }
        catch(err) {
            await interaction.reply("Something went wrong!");
            console.error(err)
        }
    }
}