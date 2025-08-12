const {SlashCommandBuilder,PermissionFlagsBits,ChatInputCommandInteraction, MessageFlags} = require('discord.js');
const mysql = require("../../database/db.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Bans a user for specific period of time")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("Target user that you want to ban")
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName("duration")
        .setDescription("The duration of the ban use this strict format '*d*h' default = 7d")
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            interaction.reply({content: "Missing Ban member permission to perform this action",flags: MessageFlags.Ephemeral});
            return;
        }
        let member = interaction.options.getMember("user");
        let duration = interaction.options.getString('duration') || "7d";
    }
}