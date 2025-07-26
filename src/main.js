const Discord = require("discord.js");
require("dotenv").config();
/////////////////////////////////////////////////////////// COMMANDS
const commandSet = [
    require("./commands/fun/joke.js"),
    require("./commands/moderation/giverole.js"),
    require("./commands/moderation/striprole.js"),
    require("./commands/moderation/delmessages.js"),
    require("./commands/utility/info.js"),
    require("./commands/moderation/lock.js"),
    require("./commands/moderation/unlock.js")
]
///////////////////////////////////////////////////////////


const client = new Discord.Client({
    intents:  [Discord.GatewayIntentBits.Guilds,
               Discord.GatewayIntentBits.GuildMessages,
               Discord.GatewayIntentBits.MessageContent,
               Discord.GatewayIntentBits.GuildPresences]
});

// REGISTRING THE COMMANDS FOR QUICK RETRIEVAL ON InteractionCreate EVENT TRIGGER
client.commands = new Discord.Collection();
for(command of commandSet) {
    client.commands.set(command.data.name , command);
}

const badWords = [process.env.badword_1,process.env.badword_2,process.env.badword_3,process.env.badword_4];

client.once(Discord.Events.ClientReady, (client) => {
    console.log(`bot ready as ${client.user.tag}`)
    client.user.setActivity("Users requests",{type: Discord.ActivityType.Listening});
});

client.on(Discord.Events.MessageCreate, msg => {
    if(badWords.some(word => msg.content.includes(word))) msg.delete()
        .then(msg => msg.channel.send(`message was deleted for containing cuss words from @${msg.author.username}`));
    else if(msg.content === "hello" || msg.content === "hi") msg.reply("hi there");
});

client.on(Discord.Events.InteractionCreate, async interaction => {
    if(interaction.isChatInputCommand()) {
        let inputCommand = client.commands.get(interaction.commandName);
        if(!inputCommand) {
            await interaction.reply("no such command was found");
            return;
        } // slash command does not exist
       
        try {
            await inputCommand.execute(interaction);
        }
        catch(err) {
            console.log(err);
            await interaction.reply("something went wrong please try again");
        }
    }

})

client.login(process.env.BOT_TOKEN);



