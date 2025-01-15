import { CommandInteraction, VoiceChannel, User } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function kick(interaction: CommandInteraction) {
  const { guild, user, options } = interaction;

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
      content: "You don't have a room. Use `/room` to create one first.",
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

  const mentionedUser = options.get("user")?.user as User;
  if (!mentionedUser) {
    await interaction.reply({
      content: "Please specify a user to kick.",
      ephemeral: true,
    });
    return;
  }

  // Remove user's permission and update room data
  await channel.permissionOverwrites.delete(mentionedUser.id);
  roomData.users = roomData.users.filter((id) => id !== mentionedUser.id);

  userRooms.set(user.id, roomData);

  await interaction.reply({
    content: `Removed ${mentionedUser.username} from your room.`,
    ephemeral: true,
  });
}
