//lib
import {
  Constants,
  InteractionCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";
import colors from "colors/safe";

//namespaces
import { consoleFns } from "./consoleFunctions";

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
    await ctx.reply("test");
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
  process.stdout.write("\n"); //console.log('\n') prints out two newlines
  try {
    await consoleFns.importCommands(commandClient, interactionCommandClient);
    await consoleFns.runShard(shardClient);
    await consoleFns.runCC(commandClient);
    //await consoleFns.runICC(interactionCommandClient);
    console.log(colors.black(colors.bgGreen(`rsource records online`)));
  } catch (err) {
    console.log(colors.red("[error] ") + err);
  }
})();
