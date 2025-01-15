import { CommandInteraction, VoiceChannel } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function reveal(interaction: CommandInteraction) {
  const { guild, user } = interaction;

  if (!guild) {
    await interaction.reply({
      content: "This command must be used in a server.",
      flags: 64,
    });
    return;
  }

  const roomData = userRooms.get(user.id);
  if (!roomData) {
    await interaction.reply({
      content: "You don't have a room.",
      flags: 64,
    });
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId) as VoiceChannel;
  if (!channel) {
    userRooms.delete(user.id);
    await interaction.reply({
      content: "Your room was deleted. Use `/room <name>` to create a new one.",
      flags: 64,
    });
    return;
  }

  // Update the permissions for the @everyone role
  await channel.permissionOverwrites.create(guild.id, {
    ViewChannel: true,
    Connect: true, // Optional: Allow users to join the voice channel
  });

  roomData.visible = true;
  userRooms.set(user.id, roomData);

  await interaction.reply({
    content: "Your room is now visible to everyone in the server.",
    flags: 64,
  });
}
