//lib
import {
  Constants,
  SlashCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";
var colors = require("colors/safe");

import { runSCC, runCC, runShard } from "./consoleFunctions";

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
const slashClient = new SlashCommandClient(__private.token);
const commandClient = new CommandClient(__private.token, {
  prefix: config.prefix,
});

slashClient.add({
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
  run: (ctx) => ctx.reply("pong!"),
});

(async () => {
  //console.log('initializing commands via /commands')
  //commandClient.addMultipleIn('./commands');
  runShard(shardClient);
  runCC(commandClient);
  runSCC(slashClient);
  console.log(colors.black(colors.bgGreen(`rsource records online`)));
})();
