import { Message, VoiceChannel } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function hideRoom(message: Message) {
  const { guild, author } = message;

  if (!guild) {
    message.reply("This command must be used in a server.");
    return;
  }

  const roomData = userRooms.get(author.id);
  if (!roomData) {
    message.reply("You don't have a room.");
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId) as VoiceChannel;
  if (!channel) {
    userRooms.delete(author.id);
    message.reply("Your room was deleted. Use `!room` to create a new one.");
    return;
  }

  // Hide the channel for @everyone
  await channel.permissionOverwrites.create(guild.id, {
    ViewChannel: false,
    Connect: false,
  });

  // Hide the channel for each user added to the room
  for (const userId of roomData.users) {
    await channel.permissionOverwrites.create(userId, {
      ViewChannel: false,
    });
  }

  roomData.visible = false;
  userRooms.set(author.id, roomData);
  message.reply("Your room is now hidden from everyone.");
}
