import { CommandInteraction, VoiceChannel } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function hide(interaction: CommandInteraction) {
  const { guild, user } = interaction;

  if (!guild) {
    await interaction.reply({
      content: "This command must be used in a server.",
      ephemeral: true,
    });
    return;
  }

  const roomData = userRooms.get(user.id);
  if (!roomData) {
    await interaction.reply({
      content: "You don't have a room.",
      ephemeral: true,
    });
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId) as VoiceChannel;
  if (!channel) {
    userRooms.delete(user.id);
    await interaction.reply({
      content: "Your room was deleted. Use `/room` to create a new one.",
      ephemeral: true,
    });
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
  userRooms.set(user.id, roomData);

  await interaction.reply({
    content: "Your room is now hidden from everyone.",
    ephemeral: true,
  });
}
