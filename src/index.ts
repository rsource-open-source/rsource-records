//os
import chalk from "chalk";
//lib
import {
  CommandClient,
  Constants,
  InteractionCommandClient,
  ShardClient,
} from "detritus-client";
//env
import dotenv from "dotenv";
import os from "os";
//namespaces
import { ChalkStringFns, consoleFns } from "./consoleFunctions";
//import * as StrafesNET from './typings/StrafesNET';
//interfaces
import { IConfig, IEnvSpace } from "./interfaces";
//utils
import { errorToLogs } from "./utils";
let wifi = os.networkInterfaces()["Wi-Fi"];
let ethernet = os.networkInterfaces()["eth0"];

dotenv.config();

//project info
const pjson = require("../package.json");

//etc
const { InteractionCallbackTypes } = Constants;

//local fs
const config = require("../config.json") as IConfig;

//client declaration
const private_env: IEnvSpace = {
  TOKEN: <string>process.env.TOKEN,
  SN_API_KEY: <string>process.env.SN_API_KEY,
};

export const shardClient = new ShardClient(private_env.TOKEN, {
  gateway: {
    loadAllMembers: true,
  },
});
export const interactionCommandClient = new InteractionCommandClient(
  shardClient
);
export const commandClient = new CommandClient(shardClient, {
  prefix: config.prefix,
  ignoreMe: true,
  mentionsEnabled: true,
  activateOnEdits: true,
  useClusterClient: false,
});

interactionCommandClient.add({
  description: "returns pong",
  name: "ping",
  run: (ctx) => {
    return ctx.respond(
      InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
      "pong"
    );
  },
});

commandClient.add({
  name: "ping",
  run: (ctx) => {
    ctx.reply("pong").catch((x) => errorToLogs(x, shardClient));
  },
});

commandClient.add({
  name: "getuser1",
  onBefore: (ctx) => ctx.client.isOwner(ctx.userId),
  onCancel: (ctx) => ctx.reply("no"),
  run: async (ctx) => {
    //const response = fetch(
    //  "https://api.strafes.net/v1/user/49874511?api-key=" + env.TOKEN,
    //  {
    //    headers: {
    //      "Content-Type": "applications/json",
    //      Authorization: env.TOKEN,
    //    },
    //  }
    //);
    //  .then((res) => console.log("resolved", res.json()))
    //  .then((data) => console.log("data", data))
    //  .catch((err) => console.error("error", err));
    await ctx.reply("data");
  },
});

interactionCommandClient.add({
  name: "getuser",
  description: "yep",
  onBefore: (ctx) => ctx.client.isOwner(ctx.userId),
  onCancel: (ctx) =>
    ctx.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, "no"),
  run: async (ctx) => {
    await ctx.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, "");
  },
});

shardClient.on("messageCreate", async (payload) => {
  const PL = payload.message;
  if (PL.author.isMe) return;
  if (PL.webhookId === undefined) return;
  if (PL.webhookId !== "891161056876056606") return;
  console.log(JSON.parse(PL.content.slice(8, PL.content.length - 3)));
});

(async () => {
  process.stdout.write("\n");
  try {
    await consoleFns.runShard(shardClient);
    await consoleFns.importCommands(commandClient, interactionCommandClient);
    await consoleFns.runCC(commandClient);
    //await consoleFns.runICC(interactionCommandClient);
    await consoleFns.log({
      color: ChalkStringFns.MAGENTA,
      title: "success",
      message: "rsource records online :3",
    });
    await consoleFns.log({
      color: ChalkStringFns.CYAN,
      title: "local info",
      message: `running on machine address ${chalk.bold(
        typeof wifi === undefined ? ethernet![1]?.address : wifi![1]?.address
      )} branch ${chalk.bold(await consoleFns.getBranch())}`,
    });
    await consoleFns.log({
      color: ChalkStringFns.CYAN,
      title: "local info",
      message: `rsource-records version ${chalk.bold(
        pjson.version
      )}, node version ${chalk.bold(process.versions.node)}`,
    });
  } catch (err) {
    await consoleFns.err(<Error>err);
  }
})();
