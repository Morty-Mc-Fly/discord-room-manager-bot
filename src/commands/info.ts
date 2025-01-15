import { CommandInteraction } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function info(interaction: CommandInteraction) {
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

  const visibleStatus = roomData.visible ? "visible" : "invisible";
  const userList =
    roomData.users.map((id) => `<@${id}>`).join(", ") || "No users added.";

  await interaction.reply({
    content: `**Room Info:**
    - **Users**: ${userList}
    - **Visibility**: ${visibleStatus}`,
    flags: 64,
  });
}
