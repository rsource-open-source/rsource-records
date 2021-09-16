import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";

import colors from "colors/safe";

import { IConfig } from "./interfaces";
const config = require("../config.json") as IConfig;

export namespace consoleFns {
  export function log({ color, title, message }: { color: string, title: string, message: string }) {
    console.log(`${colors[color](`[${title}]`)} ${message}`)
  }
  export function err(error: Error) {
    return log({ color: 'red', title: 'error', message: error.message })
  }
  export async function importCommands(
    commandClient: CommandClient,
    interactionCommandClient: InteractionCommandClient
  ) {
    log({ color: 'green', title: 'run', message: 'importing and initializing commands' })

    await commandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err)
    log({ color: 'blue', title: 'import', message: 'imported prefixed commands' })
    

    await interactionCommandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err);
    log({ color: 'blue', title: 'import', message: 'imported slash commands' })
  }

  export async function runShard(shardClient: ShardClient) {
    
    await shardClient.run();
    log({ color: 'green', title: 'run', message: `Started shard ${shardClient.id}` })

    shardClient.gateway.setPresence({
      //await does not have affect on this
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
    log({ color: 'green', title: 'run', message: `Updated presence of shard ${shardClient.id}` })
  }

  export async function runCC(commandClient: CommandClient) {
    log({ color: 'green', title: 'run', message: `Starting CommandClient` })
    await commandClient.run();
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    log({ color: 'green', title: 'run', message: `Started Slash CommandClient` })
    await interactionCommandClient.run();
  }
}
