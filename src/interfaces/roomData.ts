export interface RoomData {
  channelId: string;
  users: string[];
  visible: boolean;
}

export const userRooms = new Map<string, RoomData>();
