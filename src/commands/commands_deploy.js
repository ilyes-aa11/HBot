const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });


const rest = new REST().setToken(process.env.BOT_TOKEN);

// append the new commands here No need to modify anything else
const filesPath = fs.readdirSync(__dirname, {recursive: true})
.filter(file => path.extname(file) == ".js" && path.basename(file) != "commands_deploy.js")
.map(file => path.join(__dirname,file));

let commands = []
for(file of filesPath) {
  commands.push(require(file).data.toJSON());
}


// deployment
(async function() {
  try {
    console.log('🔁 Deploying slash commands...');

    // Option A: Per-guild (instant update)
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    // Option B: Global (can take up to 1 hour)
    // await rest.put(
    //   Routes.applicationCommands(process.env.CLIENT_ID),
    //   { body: commands },
    // );

    console.log('✅ Slash commands deployed successfully.');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
})();


