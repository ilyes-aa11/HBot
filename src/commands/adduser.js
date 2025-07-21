const {SlashCommandBuilder} = require("discord.js");
const db = require("../mysqldb/db.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("adds a user to the database")
    .addUserOption(option => option.setName("user").setDescription("mention the user you want to add").setRequired(true)) ,
    
    async execute(interaction, connection) {
        let user = interaction.options.getUser("user");
        let userName = user.username;
        let globalName = user.globalName || null;
        let id = user.id;
        const creationDate = user.createdAt.toISOString().slice(0, 19).replace("T", " ");
        let sql_query = `INSERT INTO users VALUES (?,?,?,?)`;
        await db.queryDb(sql_query,connection,[id,userName,globalName,creationDate]);
        await interaction.reply("user added successfully!")
    }
}