//lib
import {
  Constants,
  InteractionCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";
import * as Colors from "colors";

//namespaces
import { consoleFns } from "./consoleFunctions";

//import * as SNtypings from "SNtypings";

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
    //fetch(
    //  "https://api.strafes.net/v1/user/49874511?api-key=asdasddasdasd" // + __private.apikey
    //)
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
  process.stdout.write("\n"); //console.log('\n') prints out two newlines
  try {
    await consoleFns.importCommands(commandClient, interactionCommandClient);
    await consoleFns.runShard(shardClient);
    await consoleFns.runCC(commandClient);
    //await consoleFns.runICC(interactionCommandClient);
    await consoleFns.log({
      color: Colors.magenta,
      title: "success",
      message: "rsource records online :3",
    });
  } catch (err) {
    //i dont get this part why the hell is it unknown
    //Argument of type 'unknown' is not assignable to parameter of type 'Error'.
    await consoleFns.err(err);
  }
})();
