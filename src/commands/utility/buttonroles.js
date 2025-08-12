const {SlashCommandBuilder,MessageFlags,ActionRowBuilder,ButtonBuilder,ButtonStyle} = require("discord.js");
const mysql = require("../../database/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("buttonroles")
    .setDescription("Provides message containing a list of roles in form of button that can chosen from")
    .setContexts(InteractionContextType.Guild),

    async execute(interaction) {
        const guildId = interaction.guildId;
        let [row] = await mysql.execute("SELECT roles FROM btnroles_conf WHERE guild_id=?",[String(guildId)]);
        if(row.length == 0) {
            interaction.reply({content: "This command is not configured yet!", flags: MessageFlags.Ephemeral});
            return;
        }
        const roleNames = row[0].roles;
        
        let numRows = Math.ceil(roleNames.length / 5);
        let rows = [];
        let j = 0;
        for(let i = 1;i <= numRows;i++) {
            let row = new ActionRowBuilder();
            for(;j < Math.min(roleNames.length , i*5);j++) {
                let button = new ButtonBuilder().setCustomId(roleNames[j]).setLabel(roleNames[j]).setStyle(ButtonStyle.Primary);
                row.addComponents(button);
            }
            rows.push(row);
        }

        await interaction.reply({components: rows});
    }
}