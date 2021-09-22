//lib
import {
  Constants,
  InteractionCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";

//namespaces
import { ChalkStringFns, consoleFns } from "./consoleFunctions";

//import * as StrafesNET from './typings/StrafesNET';

//interfaces
import { IPrivate, IConfig } from "./interfaces";

//etc
const { InteractionCallbackTypes } = Constants;

//local fs
const __private = require("../private.json") as IPrivate;
const config = require("../config.json") as IConfig;

//client declaration
const shardClient = new ShardClient(__private.token, {
  gateway: {
    loadAllMembers: true,
  },
});
const interactionCommandClient = new InteractionCommandClient(__private.token);
const commandClient = new CommandClient(__private.token, {
  prefix: config.prefix,
  ignoreMe: true,
  mentionsEnabled: true,
  activateOnEdits: true,
  useClusterClient: false,
});

interactionCommandClient.add({
  description: "shot",
  name: "shit",
  run: (ctx) => {
    return ctx.respond(
      InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
      "u shit ur shot"
    );
  },
});

commandClient.add({
  name: "ping",
  run: (ctx) => {
    ctx.reply("pong");
  },
});

commandClient.add({
  name: "getuser1",
  onBefore: (ctx) => ctx.client.isOwner(ctx.userId),
  onCancel: (ctx) => ctx.reply("no"),
  run: async (ctx) => {
    //why the fuck doesnt this api req work?
    //leaving this here for later
    //const response = fetch(
    //  "https://api.strafes.net/v1/user/49874511?api-key=" + __private.apikey,
    //  {
    //    headers: {
    //      "Content-Type": "applications/json",
    //      Authorization: __private.apikey,
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
  onBefore: (ctx) => ctx.client.isOwner(ctx.userId),
  onCancel: (ctx) =>
    ctx.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, "no"),
  run: async (ctx) => {
    await ctx.respond(
      InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
      "test"
    );
  },
});

(async () => {
  process.stdout.write("\n");
  try {
    await consoleFns.importCommands(commandClient, interactionCommandClient);
    await consoleFns.runShard(shardClient);
    await consoleFns.runCC(commandClient);
    await consoleFns.runICC(interactionCommandClient);
    await consoleFns.log({
      color: ChalkStringFns.MAGENTA,
      title: "success",
      message: "rsource records online :3",
    });
  } catch (err) {
    await consoleFns.err(<Error>err);
  }
})();
