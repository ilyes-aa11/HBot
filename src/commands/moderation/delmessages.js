const {SlashCommandBuilder,PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("delmsg")
    .setDescription("deletes an indicated number of messages in the channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => option.setName("number").setDescription("the number messages to be deleted 'optional' default value = 10")),

    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
            await interaction.reply("Missing required permissions to perform this action");

        let num = interaction.options.getInteger("number") || 10;
        await interaction.channel.bulkDelete(num);
        await interaction.reply(`deleted ${num} messages`);
        // deletes the reply message after 2 seconds
        setTimeout(async () => {
        await interaction.deleteReply();
        }, 2000); 

    }
}