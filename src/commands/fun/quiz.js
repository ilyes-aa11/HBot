const {SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ActionRow} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("Interactive command to generate a custom prefered quiz question"),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {

        let category = new StringSelectMenuBuilder()
        .setCustomId('quiz-category')
        .setPlaceholder('Category')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("General Knowledge")
            .setValue('9'),

            new StringSelectMenuOptionBuilder()
            .setLabel("History")
            .setValue('23'),

            new StringSelectMenuOptionBuilder()
            .setLabel("Geography")
            .setValue('22'),

            new StringSelectMenuOptionBuilder()
            .setLabel("Maths")
            .setValue('19'),

            new StringSelectMenuOptionBuilder()
            .setLabel("Computer Science")
            .setValue('18')
        )
        
        let difficulty = new StringSelectMenuBuilder()
        .setCustomId('quiz-difficulty')
        .setPlaceholder('Difficulty')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Easy")
            .setValue("easy"),

            new StringSelectMenuOptionBuilder()
            .setLabel("Medium")
            .setValue("medium"),

            new StringSelectMenuOptionBuilder()
            .setLabel("Hard")
            .setValue("hard")
        )
        
        let type = new StringSelectMenuBuilder()
        .setCustomId('quiz-type')
        .setPlaceholder('Type')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Multiple Choice")
            .setValue("multiple"),

            new StringSelectMenuOptionBuilder()
            .setLabel("True/False")
            .setValue("boolean") 
        )
        let rows = [
            new ActionRowBuilder().addComponents(category),
            new ActionRowBuilder().addComponents(difficulty),
            new ActionRowBuilder().addComponents(type)
        ];

        await interaction.reply({
            content: "Please select the below options to generate your question",
            components: rows
        });
    }
}