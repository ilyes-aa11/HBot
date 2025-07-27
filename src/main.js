const Discord = require("discord.js");
const mysql = require("./mysqldb/db.js")
require("dotenv").config();
/////////////////////////////////////////////////////////// COMMANDS
const commandSet = [
    require("./commands/fun/joke.js"),
    require("./commands/moderation/giverole.js"),
    require("./commands/moderation/striprole.js"),
    require("./commands/moderation/delmessages.js"),
    require("./commands/utility/info.js"),
    require("./commands/moderation/lock.js"),
    require("./commands/moderation/unlock.js"),
    require("./commands/config/setwelcome.js")
]
///////////////////////////////////////////////////////////


const client = new Discord.Client({
    intents:  [Discord.GatewayIntentBits.Guilds,
               Discord.GatewayIntentBits.GuildMembers,
               Discord.GatewayIntentBits.GuildMessages,
               Discord.GatewayIntentBits.MessageContent,
               Discord.GatewayIntentBits.GuildPresences]
});

// REGISTRING THE COMMANDS FOR QUICK RETRIEVAL ON InteractionCreate EVENT TRIGGER
client.commands = new Discord.Collection();
for(command of commandSet) {
    client.commands.set(command.data.name , command);
}

// ADDING ALL THE WELCOME CONFIGS TO A COLLECTION FOR FAST RETRIEVAL
client.welcomes = new Discord.Collection();
(async function() {
    mysql.createConnection()
    .then(connection =>
        mysql.queryDb("SELECT guild_id,welcome_channel,welcome_message FROM server_conf",connection)
    ).then(rows => {
        for(row of rows) {
            client.welcomes.set(row.guild_id, row)
        }
    }).catch(err => {
        console.log("Something wrong happened with retrieving welcome configs from database")
        console.error(err)
    })
})()

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
})

client.on(Discord.Events.GuildMemberAdd, async member => {
    try {
        let guildId = member.guild.id;
        if(client.welcomes.has(guildId)) {
            let welcomeConf = client.welcomes.get(guildId);
            let welcomeChannelId = welcomeConf.welcome_channel;
            let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
            if(!welcomeChannel) {
                welcomeChannel = await member.guild.channels.fetch(welcomeChannelId);
            }
            let welcomeMessage = welcomeConf.welcome_message;
            
            if (welcomeChannel && welcomeChannel.isTextBased()) {
                await welcomeChannel.send(welcomeMessage.replaceAll("@user", `<@${member.id}>`));
            } 
            else {
                console.warn(`Welcome channel not found or not text-based for guild ${guildId}`);
            }
        }
    } catch(err) {
        console.error("Something went wrong with GuildMemberAdd Event handler");
        console.error(err);
    }
        
})

client.login(process.env.BOT_TOKEN);



