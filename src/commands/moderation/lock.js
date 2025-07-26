const {SlashCommandBuilder , PermissionFlagsBits} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks channel and blocks users from sending messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addRoleOption(option =>
        option.setName("role").setDescription("Optional default = @everyone")
    ),

    async execute(interaction) {
        if(interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            let targetRole = interaction.options.getRole("role") || interaction.guild.roles.everyone
            await interaction.channel.permissionOverwrites.edit(targetRole , {
                SendMessages: false
            })
            await interaction.reply(`Channel locked for <@&${targetRole.id}>`)
        }
        else 
            await interaction.reply({content: "Missing permissions!", ephemeral: true})
    }
}