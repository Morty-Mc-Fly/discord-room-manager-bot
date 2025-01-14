import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { handleCommand } from "./handlers/commandHandler";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  // Pass the command to the command handler
  await handleCommand(message);
});

client.login(process.env.DISCORD_BOT_TOKEN);
