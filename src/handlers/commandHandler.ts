import { CommandInteraction } from "discord.js";

export async function handleCommand(interaction: CommandInteraction) {
  const commandName = interaction.commandName;

  try {
    // Dynamically import the command module
    const commandModule = await import(`../commands/${commandName}`);
    const command = commandModule[commandName];

    if (typeof command === "function") {
      await command(interaction);
    } else {
      await interaction.reply({
        content: "Command not implemented.",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(`Error handling command ${commandName}:`, error);
    await interaction.reply({
      content: "An error occurred while executing the command.",
      ephemeral: true,
    });
  }
}
