import { Message, VoiceChannel } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function kickUsers(message: Message) {
  const { guild, author } = message;

  if (!guild) {
    message.reply("This command must be used in a server.");
    return;
  }

  const roomData = userRooms.get(author.id);
  if (!roomData) {
    message.reply("You don't have a room. Use `!room` to create one first.");
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId) as VoiceChannel;
  if (!channel) {
    userRooms.delete(author.id);
    message.reply("Your room was deleted. Use `!room` to create a new one.");
    return;
  }

  const mentionedUsers = message.mentions.users.map((user) => user.id);
  if (mentionedUsers.length === 0) {
    message.reply("Please mention users to kick.");
    return;
  }

  for (const userId of mentionedUsers) {
    await channel.permissionOverwrites.delete(userId);
    roomData.users = roomData.users.filter((id) => id !== userId);
  }

  userRooms.set(author.id, roomData);
  message.reply(`Removed ${mentionedUsers.length} user(s) from your room.`);
}
