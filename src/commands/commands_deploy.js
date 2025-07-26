const { REST, Routes } = require('discord.js');
const removerole = require('./striprole.js');
require('dotenv').config({ path: '../.env' });


const rest = new REST().setToken(process.env.BOT_TOKEN);

// append the new commands here No need to modify anything else
const commands = [require("./joke.js").data.toJSON(), 
                  require("./giverole.js").data.toJSON(),
                  require("./striprole.js").data.toJSON(),
                  require("./delmessages.js").data.toJSON(),
                  require("./info.js").data.toJSON(),
                  require("./lock.js").data.toJSON(),
                  require("./unlock.js").data.toJSON()]; 

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


