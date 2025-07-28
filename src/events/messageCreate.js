const {Events} = require('discord.js');

function handler(client, curseWords, message) {
    if(curseWords.some(word => message.content.includes(word))) message.delete()
        .then(message => message.channel.send(`message was deleted for containing cuss words from @${message.author.username}`));
    else if(message.content === "hello" || message.content === "hi") message.reply("hi there");
}

module.exports = {
    event: Events.MessageCreate,
    handler
}