const {SlashCommandBuilder,SlashCommandUserOption,SlashCommandRoleOption,PermissionFlagsBits} = require("discord.js");


let usr = new SlashCommandUserOption()
                .setName("user")
                .setDescription("The user you want to give the role to")
                .setRequired(true);

let role = new SlashCommandRoleOption()
                .setName("role")
                .setDescription("The role you want to give")
                .setRequired(true);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("gives a role to a user")
    .addUserOption(usr)
    .addRoleOption(role),

    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) 
            await interaction.reply("Missing required permissions (Manage Roles)");
        
        let user_id = interaction.options.getUser("user").id;
        let user = await interaction.guild.members.fetch(user_id);
        let role_id = interaction.options.getRole("role").id;
        let role = interaction.guild.roles.cache.get(role_id);
        
        if(user.roles.cache.has(role_id)) 
            await interaction.reply("user already has the role");
        else {
            await user.roles.add(role);
            await interaction.reply("role has been added successfully");
        }
        
    }
}