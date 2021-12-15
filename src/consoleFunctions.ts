import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";

import { rConsole } from "rsource-utils";

import { IConfig } from "./interfaces";
const config = require("../config.json") as IConfig;
const pjson = require("../package.json");

export enum ChalkStringFns {
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
  // export async function log({
  //   color,
  //   title,
  //   message,
  // }: {
  //   color: ChalkStringFns;
  //   title: string;
  //   message: Error | string;
  // }) {
  //   console.log(
  //     `${chalk.gray(
  //       `[${new Date().toLocaleTimeString("en-US")}] ${chalk.blue(pjson.name)}`
  //       //@ts-ignore
  //     )} ${chalk[color](`[${title}]`)} ${message}`
  //   );
  // }

  // export async function logInfo(
  //   message: Error | string,
  //   title?: string,
  //   color?: ChalkStringFns
  // ) {
  //   console.log(
  //     //@ts-ignore
  //     `${chalk.gray(`[${new Date().toLocaleTimeString("en-US")}]`)} ${chalk[
  //       color ? color : ChalkStringFns.UNDERLINE
  //     ](`[${title ? title : "log"}]`)} ${message}`
  //   );
  // }

  export async function err(error: Error) {
    try {
      rConsole.log("error", error.message, "red", true, error.name, false);
      process.exit();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  }

  export async function importCommands(
    commandClient: CommandClient,
    interactionCommandClient: InteractionCommandClient
  ) {
    rConsole.log(
      "import",
      "Importing and initializing commands",
      "green",
      false,
      undefined,
      false
    );

    await commandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch((x) => {
        consoleFns.err(x);
      });
    rConsole.log(
      "import",
      "imported prefixed commands",
      "blue",
      false,
      undefined,
      false
    );

    await interactionCommandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err);
    rConsole.log(
      "import",
      "imported interaction commands",
      "blue",
      false,
      undefined,
      false
    );
  }

  export async function runShard(shardClient: ShardClient) {
    await shardClient.run();
    rConsole.log(
      "run",
      `Started shard ${shardClient.shardId}`,
      "green",
      false,
      undefined,
      false
    );

    const branch = rConsole.getBranch();

    shardClient.gateway.setPresence({
      activity: {
        name: `${
          config.shout === null
            ? `v${pjson.version} | ${config.prefix} | [${
                //@ts-ignore
                branch == "main" || branch === "dev"
                  ? "" + branch
                  : "dev." + branch
              }]`
            : config.shout
        }`,
        type: 1,
        url: "https://twitch.tv/insyri",
      },
    });
    rConsole.log(
      "run",
      `Set presence for shard ${shardClient.shardId}`,
      "green",
      false,
      undefined,
      false
    );
  }

  export async function runCC(commandClient: CommandClient) {
    rConsole.log(
      "run",
      `Starting command client`,
      "green",
      false,
      undefined,
      false
    );
    await commandClient.run();
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    rConsole.log(
      "run",
      `Starting interaction command client`,
      "green",
      false,
      undefined,
      false
    );
    await interactionCommandClient.run();
  }
}

export interface StatisticWebhook {
  prespeed: number;
  playerid: number;
  ssj: number[];
  gain: number[]; // -> 100.00(%)
  sync: number[]; // -> 100.00(%)
  spj: number[]; // 0 -> inf; strafes per jump
  speed: number[]; // 0 -> inf; current units/second
  time: number; // elapsed time from start to finish
  //array length will depend on how many jumps,
  //7 jumps will generate arrays of 7 in length
}
