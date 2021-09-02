//lib
import {
  Constants,
  SlashCommandClient,
  CommandClient,
  ShardClient,
} from "detritus-client";
var colors = require("colors/safe");

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
  console.log(colors.green("[run] ") + "shard client");
  await shardClient.run().catch((err) => {
    console.log(colors.red("[error] ") + err);
  });
  //
  console.log(colors.green("[run] ") + "modifying presence");
  try {
    shardClient.gateway.setPresence({
      activity: {
        name: `${
          config.shout === null
            ? shardClient.guilds.toString().match(/\d+/g)! + " guilds"
            : config.shout
        } | ${config.prefix}`,
        type: 1,
        url: "https://twitch.tv/insyri",
      },
    });
  } catch (err) {
    console.log(colors.red("[error] ") + err);
  }
  console.log(colors.green("[run] ") + "command client");
  await commandClient.run().catch((err) => {
    console.log(colors.red("[error] ") + err);
  });
  console.log(colors.green("[run] ") + "slash client");
  await slashClient.run().catch((err) => {
    console.log(colors.red("[error] ") + err);
  });
  console.log(colors.black(colors.bgGreen(`rsource records online`)));
})();
