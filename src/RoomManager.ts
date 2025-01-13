import {
  Guild,
  GuildChannel,
  PermissionsBitField,
  ChannelType,
  VoiceChannel,
} from "discord.js";

export class RoomManager {
  private userVoiceChannels: Map<string, string> = new Map();

  private async getRoomChannel(
    guild: Guild,
    userId: string
  ): Promise<VoiceChannel | null> {
    const channelId = this.userVoiceChannels.get(userId);
    if (!channelId) return null;

    const channel = guild.channels.cache.get(channelId) as VoiceChannel | null;
    if (!channel) {
      this.userVoiceChannels.delete(userId); // Clean up stale data
    }
    return channel;
  }

  async createRoom(
    guild: Guild,
    userId: string,
    username: string
  ): Promise<GuildChannel | string> {
    const existingChannel = await this.getRoomChannel(guild, userId);
    if (existingChannel) {
      return `You already have a room: ${existingChannel.name}`;
    }

    // Define permissions for the channel creator
    const newChannel = await guild.channels.create({
      name: `${username}'s Room`,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          id: guild.id, // Default permissions for everyone
          deny: [PermissionsBitField.Flags.ViewChannel], // Make channel hidden by default
        },
        {
          id: userId, // Creator gets permissions
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.MoveMembers, // Optional: Allow moving members
          ],
          deny: [PermissionsBitField.Flags.MuteMembers], // Explicitly deny mute rights
        },
      ],
    });

    this.userVoiceChannels.set(userId, newChannel.id);
    return newChannel;
  }

  async deleteRoom(guild: Guild, userId: string): Promise<string> {
    const channel = await this.getRoomChannel(guild, userId);
    if (!channel) {
      return "Your room was already deleted.";
    }

    await channel.delete();
    this.userVoiceChannels.delete(userId);
    return "Your room has been deleted.";
  }

  async addUserToRoom(
    guild: Guild,
    userId: string,
    mentionedUserId: string
  ): Promise<string> {
    const channel = await this.getRoomChannel(guild, userId);
    if (!channel) {
      return "Your room was deleted. You can create a new one.";
    }

    await channel.permissionOverwrites.create(mentionedUserId, {
      ViewChannel: true,
      Connect: true,
    });

    return `User has been added to your room.`;
  }

  async removeUserFromRoom(
    guild: Guild,
    userId: string,
    mentionedUserId: string
  ): Promise<string> {
    const channel = await this.getRoomChannel(guild, userId);
    if (!channel) {
      return "Your room was deleted. You can create a new one.";
    }

    try {
      await channel.permissionOverwrites.delete(mentionedUserId);
      return `User has been removed from your room.`;
    } catch (error) {
      console.error("Failed to update permissions:", error);
      return "Failed to remove the user. Please check my role and permissions.";
    }
  }
}
