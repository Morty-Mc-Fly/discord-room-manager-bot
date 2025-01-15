import { CommandInteraction, Guild } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function evict(interaction: CommandInteraction) {
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
      content: "You don't have a room to delete.",
      flags: 64,
    });
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId);
  if (channel) {
    await channel.delete().catch((error) => {
      console.error("Failed to delete the channel:", error);
      interaction.reply({
        content: "There was an error deleting your room. Please try again.",
        flags: 64,
      });
      return;
    });
  }

  userRooms.delete(user.id);

  await interaction.reply({
    content: "Your room has been deleted.",
    flags: 64,
  });
}
