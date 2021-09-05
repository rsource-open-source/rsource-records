import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";

import colors from "colors/safe";

import { IConfig } from "./interfaces";
const config = require("../config.json") as IConfig;

export namespace consoleFns {
  export async function runShard(shardClient: ShardClient) {
    console.log(colors.green("[run] ") + "shard client");
    await shardClient.run().catch((err: Error) => {
      console.log(colors.red("[error] ") + err);
    });
    console.log(colors.green("[run] ") + "modifying presence");
    try {
      shardClient.gateway.setPresence({
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
    } catch (err) {
      console.log(colors.red("[error] ") + err);
    }
  }

  export async function runCC(commandClient: CommandClient) {
    console.log(colors.green("[run] ") + "command client");
    await commandClient.run().catch((err: Error) => {
      console.log(colors.red("[error] ") + err);
    });
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    console.log(colors.green("[run] ") + "slash client");
    await interactionCommandClient.run().catch((err: Error) => {
      console.log(colors.red("[error] ") + err);
    });
  }
}
