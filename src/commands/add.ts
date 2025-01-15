import { CommandInteraction, Guild, VoiceChannel, User } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function add(interaction: CommandInteraction) {
  const { guild, user, options } = interaction;

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
      content: "You don't have a room. Use `/room` to create one first.",
      flags: 64,
    });
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId) as VoiceChannel;
  if (!channel) {
    userRooms.delete(user.id);
    await interaction.reply({
      content: "Your room was deleted. Use `/room` to create a new one.",
      flags: 64,
    });
    return;
  }

  const mentionedUser = options.get("user")?.user as User;
  if (!mentionedUser) {
    await interaction.reply({
      content: "Please specify a user to add.",
      flags: 64,
    });
    return;
  }

  // Add user permissions to the channel
  await channel.permissionOverwrites.create(mentionedUser.id, {
    ViewChannel: true,
    Connect: true,
  });

  // Update room data
  roomData.users.push(mentionedUser.id);
  userRooms.set(user.id, roomData);

  await interaction.reply({
    content: `Added ${mentionedUser.username} to your room.`,
    flags: 64,
  });
}
