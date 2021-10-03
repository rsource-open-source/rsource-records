import {
  ShardClient,
  CommandClient,
  InteractionCommandClient,
} from "detritus-client";
import { exec } from "child_process";

import { IConfig } from "./interfaces";
import chalk from "chalk";
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
  export const getBranch = () =>
    new Promise((resolve, reject) => {
      return exec("git rev-parse --abbrev-ref HEAD", (err, stdout, _) => {
        if (err) consoleFns.err(err);
        else if (stdout === undefined) reject("lol");
        else if (typeof stdout === "string") resolve(stdout.trim());
      });
    });

  export async function log({
    color,
    title,
    message,
  }: {
    color: ChalkStringFns;
    title: string;
    message: Error | string;
  }) {
    console.log(
      //@ts-ignore
      `${chalk.gray(`[${new Date().toLocaleTimeString("en-US")}]`)} ${chalk[
        color
      ](`[${title}]`)} ${message}`
    );
  }

  export async function err(error: Error) {
    try {
      log({
        color: ChalkStringFns.RED,
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
      color: ChalkStringFns.GREEN,
      title: "run",
      message: "Importing and initializing commands",
    });

    await commandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch((x) => {
        consoleFns.err(x);
      });
    log({
      color: ChalkStringFns.BLUE,
      title: "import",
      message: "imported prefixed commands",
    });

    await interactionCommandClient
      .addMultipleIn("./commands", { subdirectories: true })
      .catch(err);
    log({
      color: ChalkStringFns.BLUE,
      title: "import",
      message: "imported slash commands",
    });
  }

  export async function runShard(shardClient: ShardClient) {
    await shardClient.run();
    log({
      color: ChalkStringFns.GREEN,
      title: "run",
      message: `Started shard ${shardClient.shardId}`,
    });

    const branch = await getBranch();

    shardClient.gateway.setPresence({
      activity: {
        name: `${
          config.shout === null
            ? `v${pjson.version} | ${config.prefix} | [${
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
    log({
      color: ChalkStringFns.GREEN,
      title: "run",
      message: `Updated presence of shard ${shardClient.shardId}`,
    });
  }

  export async function runCC(commandClient: CommandClient) {
    log({
      color: ChalkStringFns.GREEN,
      title: "run",
      message: `Starting CommandClient`,
    });
    await commandClient.run();
  }

  export async function runICC(
    interactionCommandClient: InteractionCommandClient
  ) {
    log({
      color: ChalkStringFns.GREEN,
      title: "run",
      message: `Starting InteractionCommandClient`,
    });
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
