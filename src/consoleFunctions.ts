import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";

import colors from "colors/safe";
import * as Colors from "colors";

import { IConfig } from "./interfaces";
const config = require("../config.json") as IConfig;

export namespace consoleFns {
  export async function log({
    color,
    title,
    message,
  }: {
    color: Colors.Color;
    title: string;
    message: Error | string;
  }) {
    //too tired to solve this
    //below errors because: Type 'Color' cannot be used as an index type.
    console.log(`${colors[color](`[${title}]`)} ${message}`);
  }
  export async function err(error: Error) {
    try {
      log({
        color: Colors.red,
        title: "error",
        message: error,
      }).then(() => {
        process.exit();
      });
    } catch (err) {
      console.error(err);
      process.exit();
    }
  }
  export async function importCommands(
    commandClient: CommandClient,
    interactionCommandClient: InteractionCommandClient
  ) {
    log({
      color: Colors.green,
      title: "run",
      message: "Importing and initializing commands",
    });

    await commandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err);
    log({
      color: Colors.blue,
      title: "import",
      message: "imported prefixed commands",
    });

    await interactionCommandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err);
    log({
      color: Colors.blue,
      title: "import",
      message: "imported slash commands",
    });
  }

  export async function runShard(shardClient: ShardClient) {
    await shardClient.run();
    log({
      color: Colors.green,
      title: "run",
      message: `Started shard ${shardClient.shardId}`,
    });

    shardClient.gateway.setPresence({
      activity: {
        name: `${
          config.shout === null
            ? shardClient.guilds.size + " guilds"
            : config.shout
        } | ${config.prefix}`,
        type: 1,
        url: "https://twitch.tv/insyri",
      },
    });
    log({
      color: Colors.green,
      title: "run",
      message: `Updated presence of shard ${shardClient.shardId}`,
    });
  }

  export async function runCC(commandClient: CommandClient) {
    log({
      color: Colors.gray,
      title: "run",
      message: `Starting CommandClient`,
    });
    await commandClient.run();
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    log({
      color: Colors.green,
      title: "run",
      message: `Starting InteractionCommandClient`,
    });
    await interactionCommandClient.run();
  }
}
