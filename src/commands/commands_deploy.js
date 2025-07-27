const { REST, Routes } = require('discord.js');
require('dotenv').config({ path: '../.env' });


const rest = new REST().setToken(process.env.BOT_TOKEN);

// append the new commands here No need to modify anything else
const commands = [require("./fun/joke.js").data.toJSON(), 
                  require("./moderation/giverole.js").data.toJSON(),
                  require("./moderation/striprole.js").data.toJSON(),
                  require("./moderation/delmessages.js").data.toJSON(),
                  require("./utility/info.js").data.toJSON(),
                  require("./moderation/lock.js").data.toJSON(),
                  require("./moderation/unlock.js").data.toJSON(),
                  require("./config/setwelcome.js").data.toJSON()]; 

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


