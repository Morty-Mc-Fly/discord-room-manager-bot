import { Message } from "discord.js";
import { createRoom } from "../commands/room";
import { deleteRoom } from "../commands/delRoom";
import { addUsers } from "../commands/add";
import { kickUsers } from "../commands/kick";
import { roomInfo } from "../commands/roomInfo";
import { setVisible } from "../commands/show";
import { hideRoom } from "../commands/hide";
import { help } from "../commands/help";

export async function handleCommand(message: Message) {
  const [command, ...args] = message.content.split(" ");
  switch (command) {
    case "!room":
      await createRoom(message, args);
      break;
    case "!delRoom":
      await deleteRoom(message);
      break;
    case "!add":
      await addUsers(message);
      break;
    case "!kick":
      await kickUsers(message);
      break;
    case "!roomInfo":
      await roomInfo(message);
      break;
    case "!show":
      await setVisible(message);
      break;
    case "!hide":
      await hideRoom(message);
      break;
    case "!help":
      await help(message);
      break;
  }
}
