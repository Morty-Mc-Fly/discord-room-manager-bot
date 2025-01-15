import { CommandInteraction } from "discord.js";

export async function help(interaction: CommandInteraction) {
  const helpText = `
**Available Commands:**
- \`/create [name]\`: Create a personal voice room. If no name is provided, your username will be used.
- \`/evict\`: Delete your personal room.
- \`/add  @user\`: Add a user to your room.
- \`/kick @user\`: Remove a user from your room.
- \`/info\`: Display information about your room.
- \`/open\`: Make your room public.
- \`/restrict\`: Make your room private.
- \`/help\`: Show this list of commands.
  `;

  await interaction.reply({
    content: helpText,
    flags: 64,
  });
}
