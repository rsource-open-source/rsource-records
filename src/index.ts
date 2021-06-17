import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
const __private = require('../private.json') // ts(1214)
const config = require('../config.json')

const client = new Client({ intents: Intents.ALL });

client.on("message", async (message) => {
  if(message.author.bot || !message.content.startsWith(config.prefix)) return; //eventually add "/" prefix support, different from slash commands
  //now we are going to see if the command is a valid one by checking cycling all the commands' name and alias' until we find a match, if there is none, we return message "command not found"
  try {
    const files: string[] = readdirSync('./src/commands').filter(x => x.endsWith('.ts'));
    var cmdz = files.forEach(element => element.split(".")[0])
    console.log(cmdz)
    console.log(files)
    message.channel.send(files.join(' '));
    for (const file of files){
      console.log(file)
      import(file)
      .then(x => console.log(`${file} imported! ${x}`))
      .catch(err => console.log(`Failed to import ${file}. ${err}`))
      
    }
  } catch (err){
    console.error(err)
  }
});

client.once("ready", async () => {
 if (!client.user) console.log("unable_to_get_user");
 client.user?.setActivity(
   `r[ | ${client.guilds.cache.size} guilds`,
   { type: "STREAMING", url: "https://twitch.tv/insyri" }
 );
});

client.login(__private.token).then(() => console.log('rsource records online'));