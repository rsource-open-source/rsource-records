//os
//import os from "os";
//let wifi = os.networkInterfaces()["Wi-Fi"];
//let ethernet = os.networkInterfaces()["eth0"];

//utils
import { errorToLogs /*inJson, numregex*/ } from "./utils";

//env
import dotenv from "dotenv";
dotenv.config();

//detritus lib
import {
  Constants,
  InteractionCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";

//namespaces
import { ChalkStringFns, consoleFns } from "./consoleFunctions";

//project info
const pjson = require("../package.json");

//import * as StrafesNET from './typings/StrafesNET';

//interfaces
import { IConfig, IEnvSpace } from "./interfaces";
import chalk from "chalk";

//etc
const { InteractionCallbackTypes } = Constants;

//local fs
const config = require("../config.json") as IConfig;

//client declaration
const private_env: IEnvSpace = {
  TOKEN: <string>process.env.TOKEN,
  SN_API_KEY: <string>process.env.SN_API_KEY,
};

const shardClient = new ShardClient(private_env.TOKEN, {
  gateway: {
    loadAllMembers: true,
  },
});
const interactionCommandClient = new InteractionCommandClient(shardClient);
const commandClient = new CommandClient(shardClient, {
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
  name: "getuser",
  run: async (ctx) => {
    const msg = await ctx.reply("Reading message");
    let arg = ctx.content.split(" ")[1];
    if (!arg)
      return (await ctx.channel?.fetchMessage(msg.id))!.edit(
        "No argument found."
      );
    if (arg.match(/^\w+$/) == null) {
      return (await ctx.channel?.fetchMessage(msg.id))!.edit(
        "Alphanumeric characters only + `_` (REGEXP: `/^\\w+$/`)."
      );
    }
    const response = await fetch(
      `https://api.strafes.net/v1/user/${arg}?api-key=` +
        private_env.SN_API_KEY,
      {
        headers: {
          "Content-Type": "applications/json",
          Authorization: private_env.SN_API_KEY,
        },
      }
    );
    const data = await response.json();
    return (await ctx.channel?.fetchMessage(msg.id))!.edit(
      `\`\`\`json\n${JSON.stringify(data)}\`\`\``
    );
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
    //await consoleFns.log({
    //  color: ChalkStringFns.CYAN,
    //  title: "local info",
    //  message: `running on machine address ${chalk.bold(
    //    typeof wifi === undefined ? ethernet![1]?.address : wifi![1]?.address
    //  )} branch ${chalk.bold(await consoleFns.getBranch())}`,
    //});
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
