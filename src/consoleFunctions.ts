import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";

import { IConfig } from "./interfaces";
import * as colors from "colors";
const config = require("../config.json") as IConfig;

export enum ColorStringFns {
  STRIP = "strip",
  STRIPCOLORS = "stripColors",

  BLACK = "black",
  RED = "red",
  GREEN = "green",
  YELLOW = "yellow",
  BLUE = "blue",
  MAGENTA = "magenta",
  CYAN = "cyan",
  WHITE = "white",
  GRAY = "gray",
  GREY = "grey",

  BGBLACK = "bgBlack",
  BGRED = "bgRed",
  BGGREEN = "bgGreen",
  BGYELLOW = "bgYellow",
  BGBLUE = "bgBlue",
  BGMAGENTA = "bgMagenta",
  BGCYAN = "bgCyan",
  BGWHITE = "bgWhite",

  RESET = "reset",
  BOLD = "bold",
  DIM = "dim",
  ITALIC = "italic",
  UNDERLINE = "underline",
  INVERSE = "inverse",
  HIDDEN = "hidden",
  STRIKETHROUGH = "strikethrough",

  RAINBOW = "rainbow",
  ZEBRA = "zebra",
  AMERICA = "america",
  TRAP = "trap",
  RANDOM = "random",
  ZALGO = "zalgo",
}

export namespace consoleFns {
  export async function log({
    color,
    title,
    message,
  }: {
    color: ColorStringFns;
    title: string;
    message: Error | string;
  }) {
    console.log(`${colors[color](`[${title}]`)} ${message}`);
    //console.log(`${`[${title}]`} ${message} + ${color}`);
  }

  export async function err(error: Error) {
    try {
      log({
        color: ColorStringFns.RED,
        title: "error",
        message: error,
      }).then(() => {
        //keep this until i find whats up
        console.error(error.stack);
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
      color: ColorStringFns.GREEN,
      title: "run",
      message: "Importing and initializing commands",
    });

    await commandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch((x) => {
        consoleFns.err(x);
      });
    log({
      color: ColorStringFns.BLUE,
      title: "import",
      message: "imported prefixed commands",
    });

    await interactionCommandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err);
    log({
      color: ColorStringFns.BLUE,
      title: "import",
      message: "imported slash commands",
    });
  }

  export async function runShard(shardClient: ShardClient) {
    await shardClient.run();
    log({
      color: ColorStringFns.GREEN,
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
      color: ColorStringFns.GREEN,
      title: "run",
      message: `Updated presence of shard ${shardClient.shardId}`,
    });
  }

  export async function runCC(commandClient: CommandClient) {
    log({
      color: ColorStringFns.GRAY,
      title: "run",
      message: `Starting CommandClient`,
    });
    await commandClient.run();
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    log({
      color: ColorStringFns.GREEN,
      title: "run",
      message: `Starting InteractionCommandClient`,
    });
    await interactionCommandClient.run();
  }
}
