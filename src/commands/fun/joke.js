const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Get a random joke"),
    
    async execute(interaction) {
        let response = await getRandomJoke();
        if(!response) response = "i dont have a joke right now try later";
        await interaction.reply(response);
    }
};

async function getRandomJoke() {
    try{
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        if(!response.ok) {
            throw "failed to retrieve joke";
        }
        const data = await response.json();
        return `${data.setup}\n${data.punchline}`;
    }
    catch(err) {
        console.error(err);
    }
}

