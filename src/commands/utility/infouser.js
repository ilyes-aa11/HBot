const {SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, InteractionContextType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("infouser")
    .setDescription("Shows information about a user")
    .setContexts(InteractionContextType.Guild)
    .addUserOption(option =>
        option.setName("user").setDescription("Target user")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        let member = interaction.options.getMember("user") || interaction.member;
        let authorIcon = interaction.user.displayAvatarURL();
        let targetUserIcon = member.displayAvatarURL();
        let botIcon = interaction.client.user.displayAvatarURL();
        let memberRoles = Array.from(member.roles.cache.keys());
        let roleString = new String();
        for(role of memberRoles) {
            roleString = roleString + ` <@&${role}>`;
        }
        let embed = new EmbedBuilder()
        .setTitle(`${member.user.tag}'s info`)
        .setColor("#004AF7")
        .addFields(
            {name: 'Display name:',value: `${member.user.displayName}`, inline: true},
            {name: 'Global name', value: `${member.user.globalName}`, inline: true},
            {name: 'Roles', value: `${roleString}`, inline: false},
            {name: 'Created at:',value: `${member.user.createdAt}`, inline: false},
            {name: 'Joined at:',value: `${member.joinedAt}`, inline: false})
        .setTimestamp();

        if(authorIcon) 
            embed.setAuthor({name: `${interaction.user.tag}`, iconURL: `${authorIcon}`});
        else 
            embed.setAuthor({name: `${interaction.user.tag}`});

        if(targetUserIcon) 
            embed.setThumbnail(`${targetUserIcon}`);

        if(botIcon) 
            embed.setFooter({text: "Embed provided through /infouser command" , iconURL: `${botIcon}`});
        else 
            embed.setFooter({text: "Embed provided through /infouser command"});

        await interaction.reply({embeds: [embed]})
    }
}