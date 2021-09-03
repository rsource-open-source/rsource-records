import {
  ShardClient,
  CommandClient,
  SlashCommandClient,
} from "detritus-client";
var colors = require("colors/safe");

import { IConfig } from "./interfaces";
const config = require("../config.json") as IConfig;

export async function runShard(shardClient: ShardClient) {
  console.log(colors.green("[run] ") + "shard client");
  await shardClient.run().catch((err) => {
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
  await commandClient.run().catch((err) => {
    console.log(colors.red("[error] ") + err);
  });
}

export async function runSCC(slashClient: SlashCommandClient) {
  console.log(colors.green("[run] ") + "slash client");
  await slashClient.run().catch((err) => {
    console.log(colors.red("[error] ") + err);
  });
}
