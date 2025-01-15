import { CommandInteraction } from "discord.js";

export async function help(interaction: CommandInteraction) {
  const helpText = `
**Available Commands:**
- \`/room [name]\`: Create a personal voice room. If no name is provided, your username will be used.
- \`/delroom\`: Delete your personal room.
- \`/add user:@user\`: Add one or more users to your room.
- \`/kick user:@user\`: Remove one or more users from your room.
- \`/roominfo\`: Display information about your room (users and visibility).
- \`/show\`: Make your room visible to added users.
- \`/hide\`: Make your room hidden again.
- \`/help\`: Show this list of commands.
  `;

  await interaction.reply({
    content: helpText,
    ephemeral: true,
  });
}
