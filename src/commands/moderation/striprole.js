const {SlashCommandBuilder,SlashCommandUserOption,SlashCommandRoleOption,PermissionFlagsBits, InteractionContextType} = require("discord.js");


let usr = new SlashCommandUserOption()
                .setName("user")
                .setDescription("The user you want to remove the role from")
                .setRequired(true);

let role = new SlashCommandRoleOption()
                .setName("role")
                .setDescription("The role you want to remove")
                .setRequired(true);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("strip")
    .setDescription("strips a user from a role")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild)
    .addUserOption(usr)
    .addRoleOption(role),

    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) 
            await interaction.reply("Missing required permissions (Manage Roles)");

        let user_id = interaction.options.getUser("user").id;
        let user = await interaction.guild.members.fetch(user_id);
        let role_id = interaction.options.getRole("role").id;
        let role = interaction.guild.roles.cache.get(role_id);

        if(user.roles.cache.has(role_id)) {
            await user.roles.remove(role);
            await interaction.reply("role has been removed successfully from user");
        }
        else 
            await interaction.reply("user does not have the mentioned role");
    }
}

