import { Message } from "discord.js";

export interface IArgument {
  name: string,
  required: boolean,
  type: string
}

export interface ICommand {
  name: string,
  aliases?: string[],
  description: string,
  permissions: number,
  restrictions?: {
    guildOwnerOnly?: boolean,
    botOwnerOnly?: boolean,
    botPermissions: string,
  },
  args?: IArgument[],
  run(message: Message, args?: string[], flags?: string[]): Promise<void | Message>
}