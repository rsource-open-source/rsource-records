import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";

import colors from "colors/safe";

import { IConfig } from "./interfaces";
const config = require("../config.json") as IConfig;

export namespace consoleFns {
  export async function importCommands(
    commandClient: CommandClient,
    interactionCommandClient: InteractionCommandClient
  ) {
    console.log(colors.green("[run] ") + "importing and initializing commands");

    await commandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch((err: Error) => console.log(colors.red("[error] ") + err));
    console.log(colors.green("[import] ") + "imported commandClient commands");

    await interactionCommandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch((err: Error) => console.log(colors.red("[error] ") + err));
    console.log(
      colors.green("[import] ") + "imported interactionCommandClient commands"
    );
  }

  export async function runShard(shardClient: ShardClient) {
    console.log(colors.green("[run] ") + "shard client");

    await shardClient.run();
    console.log(colors.green("[run] ") + "modifying presence");

    shardClient.gateway.setPresence({
      //await does not have affect on this
      activity: {
        name: `${
          config.shout === null
            ? shardClient.guilds.toString().match(/\d+/g)! + " guilds"
            : config.shout
        } | ${config.prefix}`,
        type: 1,
        url: "https://twitch.tv/insyri",
      },
    });
  }

  export async function runCC(commandClient: CommandClient) {
    console.log(colors.green("[run] ") + "command client");
    await commandClient.run();
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    console.log(colors.green("[run] ") + "slash client");
    await interactionCommandClient.run();
  }
}
