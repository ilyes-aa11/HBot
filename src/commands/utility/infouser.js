const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("infouser")
    .setDescription("Shows information about a user")
    .addUserOption(option =>
        option.setName("user").setDescription("Target user default = command caller user")
    ),

    async execute(interaction) {
        let user = interaction.options.getMember("user") || interaction.member;
        let authorIcon = interaction.user.avatarURL();
        let embed = new EmbedBuilder()
        .setTitle(`${user.tag}'s info`)
        .setAuthor({name: `${interaction.user.tag}`, iconURL: authorIcon})
        .setColor("#004AF7")
    }
}