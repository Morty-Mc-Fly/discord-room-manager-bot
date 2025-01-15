import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export async function registerCommands(guildId: string) {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN!
  );

  const commands = [
    {
      name: "create",
      description: "Create a personal voice room",
      options: [
        {
          name: "name",
          type: 3, // STRING
          description: "The name of the room",
          required: false,
        },
      ],
    },
    {
      name: "evict",
      description: "Delete your personal room",
    },
    {
      name: "add",
      description: "Add a user to your room",
      options: [
        {
          name: "user",
          type: 6, // USER
          description: "The user to add",
          required: true,
        },
      ],
    },
    {
      name: "kick",
      description: "Remove a user from your room",
      options: [
        {
          name: "user",
          type: 6, // USER
          description: "The user to remove",
          required: true,
        },
      ],
    },
    {
      name: "info",
      description: "Display information about your personal room",
    },
    {
      name: "open",
      description: "Make your room visible to everyone",
    },
    {
      name: "restrict",
      description: "Make your room hidden again",
    },
    {
      name: "help",
      description: "Show a list of available commands",
    },
  ];

  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId),
      { body: commands }
    );

    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}
