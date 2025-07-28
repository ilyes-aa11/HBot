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
            console.error("Something went wrong with InteractionCreate Event handler");
            console.error(err);
            await interaction.reply("something went wrong please try again");
        }
    }
}

module.exports = {
    event: Events.InteractionCreate,
    handler
}