import { ICommand } from "../interfaces/CommandInterface";
import { Message } from "discord.js"

module.exports.github = {
  name: "github",
  aliases: ["gh", "source", "src"],
  description: "gives the github repository link",
  permissions: 0,
  guildOnly: false,
  async run(message: Message) {
    message.reply('https://github.com/rsource-open-source/rsource-records')
  },
} as ICommand