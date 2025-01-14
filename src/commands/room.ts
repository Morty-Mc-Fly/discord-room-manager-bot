import {
  Message,
  TextChannel,
  ChannelType,
  PermissionsBitField,
} from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function createRoom(message: Message, args: string[]) {
  const { guild, author } = message;
  const roomName = args.join(" ") || `${author.username}'s Room`;

  if (!guild || !(message.channel instanceof TextChannel)) {
    message.reply("This command must be used in a server text channel.");
    return;
  }

  if (userRooms.has(author.id)) {
    message.reply(
      "You already have a room. Use `!delRoom` to delete it first."
    );
    return;
  }

  const category = message.channel.parent;
  if (!category || category.type !== ChannelType.GuildCategory) {
    message.reply("This channel must be inside a category.");
    return;
  }

  const newChannel = await guild.channels.create({
    name: roomName,
    type: ChannelType.GuildVoice,
    parent: category.id,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: author.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.ManageChannels,
        ],
      },
    ],
  });

  userRooms.set(author.id, {
    channelId: newChannel.id,
    users: [author.id],
    visible: false,
  });

  message.reply(`Room "${roomName}" created.`);
}
