import { CommandInteraction } from "discord.js";

export async function help(interaction: CommandInteraction) {
  const helpText = `
**Available Commands:**
- \`/room [name]\`: Create a personal voice room. If no name is provided, your username will be used.
- \`/evict\`: Delete your personal room.
- \`/add  @user\`: Add one or more users to your room.
- \`/kick @user\`: Remove one or more users from your room.
- \`/info\`: Display information about your room (users and visibility).
- \`/reveal\`: Make your room visible to added users.
- \`/hide\`: Make your room hidden again.
- \`/help\`: Show this list of commands.
  `;

  await interaction.reply({
    content: helpText,
    flags: 64,
  });
}
