import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { RoomManager } from "./RoomManager";
import { Commands } from "./Commands";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const roomManager = new RoomManager();
const commands = new Commands(roomManager);

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  // Handle commands
  await commands.handleCommand(message);
});

const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);
