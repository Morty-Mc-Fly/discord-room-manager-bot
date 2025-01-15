import { CommandInteraction, Guild } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function evict(interaction: CommandInteraction) {
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
      content: "You don't have a room to delete.",
      ephemeral: true,
    });
    return;
  }

  const channel = guild.channels.cache.get(roomData.channelId);
  if (channel) {
    await channel.delete().catch((error) => {
      console.error("Failed to delete the channel:", error);
      interaction.reply({
        content: "There was an error deleting your room. Please try again.",
        ephemeral: true,
      });
      return;
    });
  }

  userRooms.delete(user.id);

  await interaction.reply({
    content: "Your room has been deleted.",
    ephemeral: true,
  });
}
