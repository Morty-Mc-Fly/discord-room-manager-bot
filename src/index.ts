import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { registerCommands } from "./registerCommands";
import { handleCommand } from "./handlers/commandHandler";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Dynamically get the first guild ID the bot is in
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error(
      "The bot is not in any guilds. Please invite it to a server."
    );
    return;
  }

  const guildId = guild.id;
  console.log(`Registering commands for Guild ID: ${guildId}`);

  // Register commands dynamically
  await registerCommands(guildId);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await handleCommand(interaction);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
