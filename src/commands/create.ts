import {
  CommandInteraction,
  TextChannel,
  ChannelType,
  CommandInteractionOptionResolver,
} from "discord.js";
import { userRooms } from "../interfaces/roomData";

export async function create(interaction: CommandInteraction) {
  try {
    const { guild, user, options } = interaction;

    if (!guild) {
      await interaction.reply({
        content: "This command must be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const roomName =
      (options as CommandInteractionOptionResolver).getString("name") ||
      `${user.username}'s Room`;

    const category = (interaction.channel as TextChannel)?.parent;
    if (!category || category.type !== ChannelType.GuildCategory) {
      await interaction.reply({
        content:
          "This command must be used in a text channel inside a category.",
        ephemeral: true,
      });
      return;
    }

    if (userRooms.has(user.id)) {
      await interaction.reply({
        content: "You already have a room. Use `/delroom` to delete it first.",
        ephemeral: true,
      });
      return;
    }

    const newChannel = await guild.channels.create({
      name: roomName,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.id, // @everyone
          deny: ["ViewChannel"],
        },
        {
          id: user.id, // Room owner
          allow: ["ViewChannel", "Connect", "ManageChannels"],
        },
      ],
    });

    userRooms.set(user.id, {
      channelId: newChannel.id,
      users: [user.id],
      visible: false,
    });

    await interaction.reply({
      content: `Room "${roomName}" created successfully.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error in /room command:", error);
    await interaction.reply({
      content: "An unexpected error occurred while executing the command.",
      ephemeral: true,
    });
  }
}
