const {SlashCommandBuilder, EmbedBuilder, GuildMember} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Provides a detailed message about the server info") ,

    async execute(interaction) {
        let embed = new EmbedBuilder()
        .setTitle(`${interaction.guild.name} info`)
        .setAuthor({name: `${interaction.user.tag}`,iconURL: `${interaction.user.avatarURL()}`})
        .setColor("#004AF7")
        .addFields(
            {name: "Owner" , value:`<@${interaction.guild.ownerId}>`},
            {name: "Total Members:" , value: `${interaction.guild.memberCount}` , inline: true},
            {name: "Online Members" , value: `${interaction.guild.presences.cache.size}` , inline: true},
            {name: "Total Channels" , value: `${interaction.guild.channels.cache.size}`},
            {name: "Created At" , value: `${interaction.guild.createdAt}`}
        )
        .setTimestamp()

        let guildIcon = interaction.guild.iconURL({ dynamic: true });
        let botIcon = interaction.client.user.avatarURL({dynamic: true});
        if(guildIcon) embed.setThumbnail(`${guildIcon}`);
        if(botIcon) embed.setFooter({text: "embed message provided through /info command" , iconURL: `${botIcon}`});
        else embed.setFooter({text: "embed message provided through /info command"});
        await interaction.reply({embeds: [embed]});
    }
}