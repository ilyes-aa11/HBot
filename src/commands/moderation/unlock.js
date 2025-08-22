const {SlashCommandBuilder , PermissionFlagsBits, InteractionContextType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks the channel if it was locked")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setContexts(InteractionContextType.Guild)
    .addRoleOption(option =>
        option.setName("role").setDescription("Optional default = @everyone")
    ),

    async execute(interaction) {
        if(interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            let targetRole = interaction.options.getRole("role") || interaction.guild.roles.everyone;
            await interaction.channel.permissionOverwrites.edit(targetRole , {
                SendMessages: true
            });
            await interaction.reply(`Channel unlocked for <@&${targetRole.id}>`);
        }
        else 
            await interaction.reply({content: "Missing permissions!", ephemeral: true});
    }
}