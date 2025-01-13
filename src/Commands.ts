import { Message, TextChannel } from "discord.js";
import { RoomManager } from "./RoomManager";

export class Commands {
  private roomManager: RoomManager;

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
  }

  async handleCommand(message: Message): Promise<void> {
    const { content, author, guild, channel } = message;

    if (content.startsWith("!room")) {
      if (!guild || !(channel instanceof TextChannel)) {
        message.reply("This command can only be used in a server text channel.");
        return;
      }

      const response = await this.roomManager.createRoom(
        guild,
        author.id,
        author.username,
        channel // Pass the text channel where the command was issued
      );

      message.reply(typeof response === "string" ? response : `Room created: ${response.name}`);
    }

    if (content.startsWith("!deletechannel")) {
      if (!guild) {
        message.reply("This command can only be used in a server.");
        return;
      }

      const response = await this.roomManager.deleteRoom(guild, author.id);
      message.reply(response);
    }

    if (content.startsWith("!adduser")) {
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) {
        message.reply("Please mention a user to add to your room.");
        return;
      }

      if (!guild) {
        message.reply("This command can only be used in a server.");
        return;
      }

      const response = await this.roomManager.addUserToRoom(
        guild,
        author.id,
        mentionedUser.id
      );
      message.reply(response);
    }

    if (content.startsWith("!removeuser")) {
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser) {
        message.reply("Please mention a user to remove from your room.");
        return;
      }

      if (!guild) {
        message.reply("This command can only be used in a server.");
        return;
      }

      const response = await this.roomManager.removeUserFromRoom(
        guild,
        author.id,
        mentionedUser.id
      );
      message.reply(response);
    }

    if (content.startsWith("!commands")) {
      const commandList = `
        **Available Commands:**
        - \`!room\`: Create a personal voice room.
        - \`!deletechannel\`: Delete your personal room.
        - \`!adduser @user\`: Add a user to your room.
        - \`!removeuser @user\`: Remove a user from your room.
        - \`!commands\`: List all commands.
      `;
      message.reply(commandList);
    }
  }
}
