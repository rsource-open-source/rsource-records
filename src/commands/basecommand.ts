import { CommandClient } from "detritus-client";
import {
  Command,
  CommandOptions,
  Context,
  FailedPermissions,
  ParsedArgs,
  ParsedErrors,
} from "detritus-client/lib/command";
import { Permissions } from "detritus-client/lib/constants";
import { Message } from "detritus-client/lib/structures/message";
import { Markup } from "detritus-client/lib/utils";
import { bitfieldToArray, capitalizeWords, generateUsage } from "../utils";

export class BaseCommand extends Command {
  constructor(client: CommandClient, options: CommandOptions) {
    super(
      client,
      Object.assign(
        {
          triggerTypingAfter: 1000,
          ratelimits: [
            { duration: 2500, limit: 3, type: "user" },
            { duration: 5000, limit: 10, type: "channel" },
            { duration: 10000, limit: 20, type: "guild" },
          ],
          metadata: {
            help: "idk good luck",
            examples: [options.name],
            description: "not implemented yet lol",
          },
        },
        options
      )
    );
  }
  run(
    context: Context,
    _unused_args: ParsedArgs = {}
  ): Promise<void | Message> {
    return context.editOrReply(
      "❌ This command is not implemented (spam ping @insyri#9314 now)"
    );
  }
  onError(
    context: Context,
    _unused_args: ParsedArgs = {},
    error: Error = new Error()
  ) {
    console.warn(error);
    let stack;
    if (error.stack) {
      stack = Markup.codeblock(error.stack, { language: "js" });
    }

    context.editOrReply(
      `❌ This command had an error: \`${error.name}: ${error.message}\` ${stack}`
    );
  }
  onRunError(
    context: Context,
    _unused_args: ParsedArgs = {},
    error: Error = new Error()
  ) {
    console.warn(error);
    let stack;
    if (error.stack) {
      stack = Markup.codeblock(error.stack, { language: "js" });
    }
    context.editOrReply(
      `❌ This command had an error while running: \`${error.name}: ${error.message}\` ${stack}`
    );
  }
  onPermissionsFail(context: Context, permissions: FailedPermissions) {
    const formattedPermissions = permissions
      .map((v) => bitfieldToArray(v, Object.keys(Permissions)))
      .flat(1)
      .map((v) => capitalizeWords(v.toLowerCase()))
      .join(", ");
    return context.editOrReply(
      `❌ You do not have the permissions to use this command (missing permissions: \`${formattedPermissions}\`)`
    );
  }
  onPermissionsFailClient(context: Context, permissions: FailedPermissions) {
    const formattedPermissions = permissions
      .map((v) => bitfieldToArray(v, Object.keys(Permissions)))
      .flat(1)
      .map((v) => capitalizeWords(v.toLowerCase()))
      .join(", ");

    return context.editOrReply(
      `❌ You do not have the permissions to use this command (missing permissions: \`${formattedPermissions}\`)`
    );
  }
  //   onRatelimit(
  //     context: Context,
  //     ratelimits: Array<{
  //       item: CommandRatelimitItem;
  //       ratelimit: CommandRatelimit.CommandRatelimit;
  //       remaining: number;
  //     }>,
  //     global: { global: boolean; now: number }
  //   ) {
  //     for (const rate of ratelimits) {
  //       var cause = "DMs";

  //       if (rate.ratelimit.type === CommandRatelimitTypes.USER)
  //         cause = context.user.mention;
  //       else if (rate.ratelimit.type === CommandRatelimitTypes.CHANNEL)
  //         cause = context.channel!.mention;
  //       else if (context.guild) cause = `\`${context.guild.name}\``;

  //       const command = global ? "commands" : `\`${context.command!.name}\``;
  //       const time = simpleGetLongAgo(Date.now() - rate.ratelimit.duration);
  //       const remaining = simpleGetLongAgo(Date.now() - rate.remaining);

  //       context.reply(
  //         replace(
  //           messages.command.ratelimit[
  //             rate.ratelimit.type as CommandRatelimitTypes
  //           ]! + messages.command.ratelimit.message,
  //           [
  //             ["{CAUSE}", cause],
  //             ["{COMMAND}", command],
  //             ["{COMMANDS}", rate.item.usages],
  //             ["{COMMANDS_MAX}", rate.ratelimit.limit],
  //             ["{TIME}", time],
  //             ["{REMAINING}", remaining],
  //           ]
  //         )
  //       );
  //     }
  //   }
  onTypeError(context: Context, _args: ParsedArgs, errors: ParsedErrors[]) {
    if (!context.command) return;
    const description = ["❌ Argument Errors:"];
    for (let key in errors)
      description.push(`\`${key}\`: ${errors[key].message}`);
    description.push(
      `Proper Usage:
\`\`\`lua\n${generateUsage(context.command)}\`\`\``
    );
    return context.editOrReply(description.join("\n"));
  }
}
