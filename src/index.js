const Discord = require("discord.js");
require("dotenv").config();
/////////////////////////////////////////////////////////// COMMANDS
const joke = require("./commands/joke.js");
const adduser = require("./commands/adduser.js");
const removeuser = require("./commands/removeuser.js");
const db = require("./mysqldb/db.js"); 
const giverole = require("./commands/giverole.js");
const striprole = require("./commands/striprole.js");
const delmsg = require("./commands/delmessages.js");
///////////////////////////////////////////////////////////


const client = new Discord.Client({
    intents:  [Discord.GatewayIntentBits.Guilds,
               Discord.GatewayIntentBits.GuildMessages,
               Discord.GatewayIntentBits.MessageContent]
});

client.commands = new Discord.Collection();
client.commands.set(joke.data.name, joke);
client.commands.set(adduser.data.name, adduser);
client.commands.set(removeuser.data.name, removeuser);
client.commands.set(giverole.data.name, giverole);
client.commands.set(striprole.data.name, striprole);
client.commands.set(delmsg.data.name, delmsg);

const badWords = [process.env.badword_1,process.env.badword_2,process.env.badword_3,process.env.badword_4];

client.once(Discord.Events.ClientReady, () => console.log(`bot ready as ${client.user.tag}`));

client.on(Discord.Events.MessageCreate, msg => {
    if(badWords.some(word => msg.content.includes(word))) msg.delete()
        .then(msg => msg.channel.send(`message was deleted for containing cuss words from @${msg.author.username}`));
    else if(msg.content === "hello" || msg.content === "hi") msg.reply("hi there");
});

client.on(Discord.Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    let inputCommand = client.commands.get(interaction.commandName);
    if(!inputCommand) {
        interaction.reply("no such command was found");
        return;
    } // slash command does not exist

    try {
        if(inputCommand.data.name == "add" || inputCommand.data.name == "remove") {
            let DiscordDb = await db.createConnection();
            await inputCommand.execute(interaction,DiscordDb);
            await db.endConnection(DiscordDb);
        }
        else await inputCommand.execute(interaction);
    }
    catch(err) {
        console.log(err);
        await interaction.reply("something went wrong please try again");
    }
})


client.login(process.env.BOT_TOKEN);


