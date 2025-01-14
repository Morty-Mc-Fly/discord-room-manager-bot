import { Message } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function deleteRoom(message: Message) {
  const { guild, author } = message;

  if (!guild) {
    message.reply("This command must be used in a server.");
    return;
  }

  const roomData = userRooms.get(author.id);
  if (!roomData) {
    message.reply("You don't have a room to delete.");
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId);
  if (channel) {
    await channel.delete();
  }
  userRooms.delete(author.id);

  message.reply("Your room has been deleted.");
}
