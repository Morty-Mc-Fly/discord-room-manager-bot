import { Message } from "discord.js";

export async function help(message: Message) {
  const helpText = `
**Available Commands:**
- \`!room [name]\`: Create a personal voice room. If no name is provided, your username will be used.
- \`!delRoom\`: Delete your personal room.
- \`!add @user\`: Add one or more users to your room.
- \`!kick @user\`: Remove one or more users from your room.
- \`!roomInfo\`: Display information about your room (users and visibility).
- \`!visible\`: Make your room visible to added users.
- \`!hide\`: Make your room hidden again.
- \`!help\`: Show this list of commands.
  `;

  await message.reply(helpText);
}
