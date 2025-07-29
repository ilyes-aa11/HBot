const {Events} = require('discord.js');

async function handler(client, interaction) {
    if(interaction.isChatInputCommand()) {
        let inputCommand = client.commands.get(interaction.commandName);
        if(!inputCommand) {
            await interaction.reply("No such command was found");
            return;
        } // slash command does not exist
        try {
            await inputCommand.execute(interaction);
        }
        catch(err) {
            console.error("Something went wrong with InteractionCreate ChatInputCommand Event handler");
            console.error(err);
            await interaction.reply("something went wrong please try again");
        }
    }
    if(interaction.isButton()) {
        try {
            let roleName = interaction.customId;
            let role = interaction.guild.roles.cache.find(r => r.name == roleName);
            if(!role) 
                role = await interaction.guild.roles.fetch().find(r => r.name == roleName);

            let member = interaction.member;
            if(member.roles.cache.has(role.id)) { // member already has the role we remove it
                await member.roles.remove(role);
                await interaction.reply({
                    content: `<@&${role.id}> has been removed from your profile`,
                    ephemeral: true
                });
            }
            else {
                await member.roles.add(role);
                await interaction.reply({
                    content: `You have been assigned the role <@&${role.id}>`,
                    ephemeral: true
                });
            }
            await setTimeout(() => interaction.deleteReply(),2000);
        }
        catch(err) {
            console.error("Something went wrong with InteractionCreate Button Event handler");
            console.error(err);
            await interaction.reply({
                content: "Something went wrong with handling the button click please try again later",
                ephemeral: true
            })
        }
    }
}

module.exports = {
    event: Events.InteractionCreate,
    handler
}