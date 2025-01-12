import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.DISCORD_BOT_TOKEN;

// Map zum Verfolgen der erstellten Voice-Channels pro Benutzer
const userVoiceChannels = new Map<string, string>();

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!c channel")) {
    const userId = message.author.id;
    const guild = message.guild;

    if (!guild) {
      message.reply("Dieser Befehl kann nur in einem Server verwendet werden.");
      return;
    }

    // Überprüfen, ob der Benutzer bereits einen Channel erstellt hat
    if (userVoiceChannels.has(userId)) {
      const channelId = userVoiceChannels.get(userId);
      const channel = guild.channels.cache.get(channelId!);
      if (channel) {
        message.reply(`Du hast bereits einen Channel: ${channel.name}`);
      } else {
        // Fallback, falls der Channel gelöscht wurde, aber noch in der Map steht
        userVoiceChannels.delete(userId);
        message.reply(
          "Dein vorheriger Channel wurde gelöscht. Du kannst jetzt einen neuen erstellen."
        );
      }
      return;
    }

    // Erstelle einen neuen Voice-Channel
    const newChannel = await guild.channels.create({
      name: `${message.author.username}'s Voice Channel`,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          id: guild.id, // Standard-Permissions für alle Mitglieder
          deny: ["ViewChannel"], // Channel unsichtbar machen
        },
        {
          id: userId, // Benutzer, der den Channel erstellt, erhält Vollzugriff
          allow: ["ViewChannel", "Connect", "ManageChannels"],
        },
      ],
    });

    userVoiceChannels.set(userId, newChannel.id); // Channel zur Map hinzufügen
    message.reply(`Dein Channel wurde erstellt: ${newChannel.name}`);
  }

  if (message.content.startsWith("!deletechannel")) {
    const userId = message.author.id;
    const guild = message.guild;

    if (!guild) {
      message.reply("Dieser Befehl kann nur in einem Server verwendet werden.");
      return;
    }

    // Überprüfen, ob der Benutzer einen Channel hat
    if (!userVoiceChannels.has(userId)) {
      message.reply("Du hast keinen Channel, den du löschen kannst.");
      return;
    }

    const channelId = userVoiceChannels.get(userId);
    const channel = guild.channels.cache.get(channelId!);

    if (channel) {
      await channel.delete();
      userVoiceChannels.delete(userId);
      message.reply("Dein Channel wurde gelöscht.");
    } else {
      // Fallback, falls der Channel bereits gelöscht wurde
      userVoiceChannels.delete(userId);
      message.reply("Dein Channel wurde bereits gelöscht.");
    }
  }
});

client.login(token);
