//os
//import os from "os";
//let wifi = os.networkInterfaces()["Wi-Fi"];
//let ethernet = os.networkInterfaces()["eth0"];

//utils
import { errorToLogs, inJson, numregex } from "./utils";
import { checkRover /*checkBloxlink*/ } from "./typeChecks";

//env
import dotenv from "dotenv";
dotenv.config();

//lib
import {
  Constants,
  InteractionCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";
import { exec } from "child_process";
//const p = require("pariah/dist");
//new p.SomeRandomAPI().raccoon()
//import getBloxlinkUser from "bloxlink";

//namespaces
import { ChalkStringFns, consoleFns } from "./consoleFunctions";
import { rover /*bloxlink*/ } from "./typingsAndClasses/Roblox2DiscordApis";

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
  //onBefore: (ctx) => ctx.client.isOwner(ctx.userId),
  //onCancel: (ctx) => ctx.reply("no"),
  run: async (ctx) => {
    let arg = ctx.content.split(" ")[1];
    const msg = await ctx.reply("Reading message");
    if (!arg)
      return (await ctx.channel?.fetchMessage(msg.id))!.edit(
        "No argument found."
      );
    if (arg.match(/^\w+$/) == null) {
      return (await ctx.channel?.fetchMessage(msg.id))!.edit(
        "Alphanumeric characters only + `_` (REGEXP: `/^\\w+$/`)."
      );
    } // santization brought up by fiveman1, thank
    let response: any;
    //unkown??
    if (arg.match(numregex) == null) {
      new Promise((resolve, reject) => {
        return exec(
          `curl -X GET "https://verify.eryn.io/api/user/${ctx.userId}" -H  "accept: application/json"`,
          (err, stdout, _) => {
            if (err) consoleFns.err(err);
            else if (stdout === undefined) reject("lol");
            else if (typeof stdout === "string") resolve(stdout.trim());
          }
        );
      }).then(async (x) => {
        if (typeof x === "string") x = JSON.parse(x);
        if (typeof x !== "object")
          // This is required so checkRover.ApiResponse(x) doesn't yell at me about being unknown
          return (await ctx.channel?.fetchMessage(msg.id))!.edit(
            "WTF?? parsed response not typeof object (even tho i json parsed it???); typeof " +
              (typeof x).toString()
          );
        if (x === null)
          return (await ctx.channel?.fetchMessage(msg.id))!.edit(
            "WTF?? parsed response null"
          );

        checkRover
          .ApiResponse(x)
          .then(async (bool) =>
            bool === true
              ? (response = new rover.ApiResponse(x))
              : (response = new rover.ApiError(x))
          );
        console.log(x, response);
        //consoleFns.logInfo("ASDASDASD", "ez");
        //would turn to type any
        //if (typeof response === "unknown")
        //  return (await ctx.channel?.fetchMessage(msg.id))!.edit(
        //    "why is it fucking unknown. response: " + response
        //  );
        //console.log(response, typeof response); // und
        (await ctx.channel?.fetchMessage(msg.id))!.edit(response);
        /*
        if (await checkRover.ApiResponse(response!)) {
          response = response! as RBXAPI.rover.ApiResponse; // trying to make it that type..?
        } else if (await checkRover.ApiError(response!)) {
          return (await ctx.channel?.fetchMessage(msg.id))!.edit(
            inJson(response!)
          );
        }
        */
        console.log(response + response.constructor.name);
        if (response.constructor.name === "ApiResponse") {
          async () => {
            console.log(true);
            const req_user = () =>
              new Promise((resolve, reject) => {
                return exec(
                  `curl -X GET "https://api.blox.link/v1/user/${ctx.userId}" -H  "accept: application/json"`,
                  (err, stdout, _) => {
                    if (err) consoleFns.err(err);
                    else if (stdout === undefined) reject("lol");
                    else if (typeof stdout === "string") resolve(stdout.trim());
                  }
                );
              }).then(async () => {
                console.log(this);
                (await ctx.channel?.fetchMessage(msg.id))!.edit(
                  "Retrieved api.blox.link content"
                );
              });
            //handle
            let x = await req_user();
            console.log(x);
            const req_username = () =>
              new Promise((resolve, reject) => {
                return exec(
                  //@ts-ignore
                  `curl -X GET "https://api.roblox.com/users/${x.primaryAccount}" -H  "accept: application/json"`,
                  (err, stdout, _) => {
                    if (err) consoleFns.err(err);
                    else if (stdout === undefined) reject("lol");
                    else if (typeof stdout === "string") resolve(stdout.trim());
                  }
                );
              }).then(async () => {
                (await ctx.channel?.fetchMessage(msg.id))!.edit(
                  "Retrieved api.roblox content"
                );
              });
            let rq_usr = await req_username();
            console.log(rq_usr);
            //@ts-ignore
            response.robloxUsername = rq_usr;
            //if (response instanceof rover) {
            //  if (response.hasOwnProperty('robloxUsername')) {
            //    response.robloxUsername = req_username();
            //  }
            //}
            response = JSON.parse(<string>req_user().toString());
          };
        }
      });
      //@ts-ignore
      response = JSON.parse(response);
      //@ts-ignore
      arg = response.robloxId;
      if (arg === undefined)
        return (await ctx.channel?.fetchMessage(msg.id))!.edit(
          "Returned undefined."
        );
    }
    //(await ctx.channel?.fetchMessage(msg.id))!.edit("Fetching results...");
    const req_ = () =>
      new Promise((resolve, reject) => {
        return exec(
          `curl -X GET "https://api.strafes.net/v1/user/${arg}" -H  "accept: application/json" -H  "api-key: ${private_env.SN_API_KEY}"`,
          (err, stdout, _) => {
            if (err) consoleFns.err(err);
            else if (stdout === undefined) reject("lol");
            else if (typeof stdout === "string") resolve(stdout.trim());
          }
        );
      });
    //const req_ = await import("node-fetch").then(() =>
    //  fetch(`https://api.strafes.net/v1/user/${arg}?api-key=${private_env}`)
    //);
    const responseRaw = await (<string | unknown>req_());
    //const response = JSON.parse(<string>responseRaw);
    //console.log(response);
    //@ts-ignore
    (await ctx.channel?.fetchMessage(msg.id))!.edit(
      inJson((responseRaw instanceof String).toString())
    );
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
