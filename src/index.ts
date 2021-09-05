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
  mentionsEnabled: true, // @bot command
  activateOnEdits: true, // edited msgs check for cmds
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
  run: (ctx) => ctx.reply("<@533757461706964993>"),
});

(async () => {
  //console.log('initializing commands via /commands')
  commandClient.addMultipleIn("./commands", { subdirectories: true });
  interactionCommandClient.addMultipleIn("./commands", {
    subdirectories: true,
  });
  //add stop on error
  await consoleFns.runShard(shardClient);
  await consoleFns.runCC(commandClient);
  await consoleFns.runICC(interactionCommandClient);
  console.log(colors.black(colors.bgGreen(`rsource records online`)));
})();
