import { Message, VoiceChannel } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function setVisible(message: Message) {
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
    message.reply(
      "You don't have a room. Use `!room <name>` to create a new one."
    );
    return;
  }

  // Update the permissions for the @everyone role
  await channel.permissionOverwrites.create(guild.id, {
    ViewChannel: true,
    Connect: true, // Optional: Allow users to join the voice channel
  });

  roomData.visible = true;
  userRooms.set(author.id, roomData);
  message.reply("Your room is now visible to everyone in the server.");
}
