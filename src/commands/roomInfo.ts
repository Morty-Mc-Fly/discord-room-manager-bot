import { Message } from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function roomInfo(message: Message) {
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

  const visibleStatus = roomData.visible ? "visible" : "invisible";
  const userList = roomData.users.map((id) => `<@${id}>`).join(", ");
  message.reply(
    `Room Info:
      - **Users**: ${userList}
      - **Visibility**: ${visibleStatus}`
  );
}
