import { Client, Collection, Intents/*, Message*/ } from 'discord.js';

//import { ICommand } from './interfaces/CommandInterface';
import { IConfig } from './interfaces/ConfigInterface';

import { readdirSync } from 'fs';
import { ICommand } from './interfaces/CommandInterface';

//This is needed so the Discord.Collection will work as assigned to <client>.commands;
//in JavaScript this wouldn't be needed since this would be taken as 'any' loosely.
declare module "discord.js" {
  export interface Client {
      commands: Collection<unknown, ICommand>
  }
}

const __private = require('../private.json') // ts(1214)
const config = require('../config.json') as IConfig;
const client = new Client({ intents: Intents.ALL });

client.commands = new Collection();

client.on("message", async (message) => {
  if(message.author.bot || !message.content.startsWith(config.prefix)) return; //eventually add "/" prefix support, different from slash commands
  const commandStr = message.content.split(" ")[0]?.substring(config.prefix.length); //gets string after prefix
  const args = message.content.split(" ").slice(1)
  if(!commandStr) {
    message.reply(`That is my prefix, you can use \`${config.prefix}help\` to see the possible entries.${message.content[config.prefix.length] === " " ? `\nThis may have been sent because of a potential space (\` \`) after the prefix.` : ``}`)
    return;
  } else {
    if(!client.commands.has(commandStr)){
      message.reply(`That isn't a valid command, caught \`${commandStr}\`.`)
      return;
    }
    try {
      client.commands.get(commandStr)?.run(message, args);
    } catch (err) {
      console.error(err);
      message.reply(`There was an error trying to execute that command.\n\`\`\`${err}\`\`\``)
      return;
    }
  }
}); 

client.once("ready", async () => {
 client.user?.setActivity(
   `r[ | ` + (config.shout == null ? client.guilds.cache.size + ' guilds' : config.shout),
   { type: "STREAMING", url: "https://twitch.tv/insyri" }
 );
  /*
  Let me tell you a little story.
  
  This small bug in the code I was trying to scope out was getting me for the past week or so.
  Arcs told me I should make an insignificant edit, and then boom, it works.
  require is branced from the local file, meaning if you're getting a file, you would have to root it from the file instead of starting from the top directory; readdir(Sync) is exactly opposite.
  If you didn't get it already, I was missing this bug because of ONE FUCKING CHARACTER, and it was on the const command line, where I was missing ONE FUCKING PERIOD.
  */
  const files: string[] = readdirSync('./dist/commands').filter(x => x.endsWith('.js'));
  for(const file of files){
    const command = require(`../dist/commands/${file.substring(0, file.length - 3)}.js`)
    //@ts-ignore
    client.commands.set(Object.keys(command)[0], command[Object.keys(command)]);
  }
});

client.login(__private.token).then(() => console.log('rsource records online'));