import { ICommand } from "../interfaces/CommandInterface";
import { Message } from "discord.js"

module.exports.ping = {
  name: "ping",
  aliases: ["p"],
  description: "returns pong",
  permissions: 0,
  async run(message: Message) {
    message.reply('pong!')
  },
} as ICommand