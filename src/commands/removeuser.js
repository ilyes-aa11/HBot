const {SlashCommandBuilder} = require("discord.js");
const db = require("../mysqldb/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("removes a user from the database")
    .addUserOption(option => option.setName("user").setDescription("mention the user you want to remove").setRequired(true)) ,
    
    async execute(interaction, connection) {
        let id = interaction.options.getUser("user").id;
        let sql_query = `DELETE FROM users WHERE id=?`;
        await db.queryDb(sql_query,connection,[id]);
        await interaction.reply("user removed successfully!")
    }
}