const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const client = new Discord.Client({
    intents:  [Discord.GatewayIntentBits.Guilds,
               Discord.GatewayIntentBits.GuildMembers,
               Discord.GatewayIntentBits.GuildMessages,
               Discord.GatewayIntentBits.GuildModeration,
               Discord.GatewayIntentBits.MessageContent,
               Discord.GatewayIntentBits.GuildPresences]
});

// ADDING THE COMMANDS  
client.commands = new Discord.Collection();

let commandsPaths = fs.readdirSync('./commands', {recursive: true}).filter(command => 
    path.extname(command) === ".js" && path.basename(command) !== "commands_deploy.js");

commandsPaths = commandsPaths.map(item => path.join(__dirname,'commands',item));

for(command of commandsPaths) {
    let commandModule = require(path.normalize(command));
    if("data" in commandModule && "execute" in commandModule)
        client.commands.set(commandModule.data.name, commandModule);
    else 
        console.error(`Missing properties for the command defined in the path ${command}`);
}

// ADDING THE EVENT HANDLERS
client.eventHandler = new Discord.Collection();

let eventHandlerPaths = fs.readdirSync('./events',{recursive: true}).map(event => path.join(__dirname,'events',event));

for(eventHandler of eventHandlerPaths) {
    let eventHandlerModule = require(path.normalize(eventHandler));
    if("event" in eventHandlerModule && "handler" in eventHandlerModule)
        client.eventHandler.set(eventHandlerModule.event, eventHandlerModule.handler);
    else 
        console.error(`Missing properties for the event handler in the path ${eventHandler}`);
}

const curseWords = process.env.curseWords.split(",");

client.once(Discord.Events.ClientReady, (client) => {
    client.commands.get("tempban").readTempBans(client);
    console.log(`bot ready as ${client.user.tag}`)
    client.user.setActivity("Users requests",{type: Discord.ActivityType.Listening});
});

client.on(Discord.Events.MessageCreate,message => client.eventHandler.get(Discord.Events.MessageCreate)(client,curseWords,message));

client.on(Discord.Events.InteractionCreate,interaction => client.eventHandler.get(Discord.Events.InteractionCreate)(client,interaction));

client.on(Discord.Events.GuildMemberAdd,member => client.eventHandler.get(Discord.Events.GuildMemberAdd)(client,member));

client.on(Discord.Events.GuildBanRemove,ban => client.eventHandler.get(Discord.Events.GuildBanRemove)(ban));

client.login(process.env.BOT_TOKEN);



