const {Events, Client, CommandInteraction, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder} = require('discord.js');
const mysql = require('../database/db.js');
const { StringSelectMenuOptionBuilder } = require('discord.js');
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
async function handler(client, interaction) {
    if(interaction.isChatInputCommand()) {
        try {
            let inputCommand = client.commands.get(interaction.commandName);
            if(!inputCommand) {
                await interaction.reply("No such command was found");
                return;
            } // slash command does not exist
            await inputCommand.execute(interaction);
        }
        catch(err) {
            console.error("Something went wrong with InteractionCreate ChatInputCommand Event handler");
            console.error(err);
            if(!interaction.replied) {
                await interaction.reply("Something went wrong please try again");
            }
            else {
                interaction.editReply("Something went wrong please try again");
            }
        }
    }
    else if(interaction.isButton()) {
        try {
            let roleName = interaction.customId;
            let role = interaction.guild.roles.cache.find(r => r.name == roleName);
            if(!role) 
                role = await interaction.guild.roles.fetch().find(r => r.name == roleName);

            let member = interaction.member;
            if(member.roles.cache.has(role.id)) { // member already has the role we remove it
                await member.roles.remove(role);
                await interaction.reply({
                    content: `<@&${role.id}> has been removed from your profile`,
                    flags: MessageFlags.Ephemeral
                });
            }
            else {
                await member.roles.add(role);
                await interaction.reply({
                    content: `You have been assigned the role <@&${role.id}>`,
                    flags: MessageFlags.Ephemeral
                });
            }
            await setTimeout(() => interaction.deleteReply(),2000);
        }
        catch(err) {
            console.error("Something went wrong with InteractionCreate Button Event handler");
            console.error(err);
            if(!interaction.replied) {
                await interaction.reply({
                    content: "Something went wrong with handling the button click please try again later",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
    else if(interaction.isStringSelectMenu()) {
        try {
            let userId = interaction.user.id;
            let guildId = interaction.guildId;
            let [res] = await mysql.execute("SELECT * FROM quiz_conf WHERE user_id=? AND guild_id=?",[String(userId),String(guildId)]);
            if(res.length == 0) await mysql.execute("INSERT INTO quiz_conf (user_id,guild_id) VALUES (?,?)",[String(userId),String(guildId)]);
            switch(interaction.customId) {
                case "quiz-category":
                    await mysql.execute("UPDATE quiz_conf SET category=? WHERE user_id=? AND guild_id=?",[interaction.values[0],String(userId),String(guildId)]);
                    await interaction.reply({content: `Selected category ${interaction.values[0]}`, flags: MessageFlags.Ephemeral});
                    setTimeout(() => {interaction.deleteReply()},1000);
                    break;
                case "quiz-difficulty":
                    await mysql.execute("UPDATE quiz_conf SET difficulty=? WHERE user_id=? AND guild_id=?",[interaction.values[0],String(userId),String(guildId)]);
                    await interaction.reply({content: `Selected difficulty ${interaction.values[0]}`, flags: MessageFlags.Ephemeral});
                    setTimeout(() => {interaction.deleteReply()},1000);
                    break;
                case "quiz-type":
                    await mysql.execute("UPDATE quiz_conf SET quest_type=? WHERE user_id=? AND guild_id=?",[interaction.values[0],String(userId),String(guildId)]);
                    await interaction.reply({content: `Selected type ${interaction.values[0]}`, flags: MessageFlags.Ephemeral});
                    setTimeout(() => {interaction.deleteReply()},1000);
                    break;
                case "quiz-question":
                    if(interaction.values[0].split('_')[0] == "correct") {
                        await interaction.reply({content: `Correct answer! from <@${interaction.user.id}>`});
                    }
                    else {
                        await interaction.reply({content: `Wrong answer!`, flags: MessageFlags.Ephemeral});
                        setTimeout(() => {interaction.deleteReply()},1000);
                    }
                    break;
                default:
                    throw new Error("Select menu id hasnt been added to the switch case list in InteractionCreate.js StringSelectMenuInteraction");
            }
            [res] = await mysql.execute("SELECT * FROM quiz_conf WHERE user_id=? AND guild_id=?",[String(userId),String(guildId)]);
            if(res[0].category && res[0].difficulty && res[0].quest_type) {
                let response = await fetch(`https://opentdb.com/api.php?amount=1&category=${res[0].category}&difficulty=${res[0].difficulty}&type=${res[0].quest_type}`);
                let data = await response.json();
                let question = data.results[0].question;
                let correct_answer = data.results[0].correct_answer; // string
                let answers = [...data.results[0].incorrect_answers];
                answers.push(correct_answer);
                // RANDOM SHUFFLING 
                for (let i = answers.length - 1; i >= 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [answers[i], answers[j]] = [answers[j], answers[i]];
                }
                let answersMenu = new StringSelectMenuBuilder().setCustomId("quiz-question");
                for(let i = 0;i < answers.length;i++) {
                    if(answers[i] == correct_answer) {
                        answersMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(answers[i]).setValue(`correct_${i}`));
                    }
                    else {
                        answersMenu.addOptions(new StringSelectMenuOptionBuilder().setLabel(answers[i]).setValue(`incorrect_${i}`));
                    }
                }
                let row = new ActionRowBuilder().addComponents(answersMenu);
                await interaction.followUp({
                    content: `${question}`,
                    components: [row]
                });
                await mysql.execute("DELETE FROM quiz_conf WHERE user_id=? AND guild_id=?",[String(userId),String(guildId)]);
            }
        }
        catch(err) {
            console.error("Something went wrong with InteractionCreate StringSelectMenu Event handler");
            console.error(err);
            if(interaction.replied) interaction.editReply({
                content: "Something went wrong with handling your selections please try again",
                flags: MessageFlags.Ephemeral
            });
            else interaction.reply({
                content: "Something went wrong with handling your selections please try again",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

module.exports = {
    event: Events.InteractionCreate,
    handler
}