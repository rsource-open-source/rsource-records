import { Command, CommandClient, Constants, Utils } from "detritus-client";
import { Markup } from "detritus-client/lib/utils";
import { transpile } from "typescript";
import { BaseCommand } from "../basecommand";

export default class EvalCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      label: "code",
      name: "eval",
      priority: 4587,
      required: true,
      args: [
        { default: false, name: "noreply", type: Boolean },
        { default: 2, name: "jsonspacing", type: "number" },
      ],
      onBefore: (context) =>
        context.user.isClientOwner || context.userId === "504698587221852172",
      onCancel: (context) => context.editOrReply("no"),
      onError: (_context, _args, error) => console.error(error),
    });
  }
  async run(context: Command.Context, args: Command.ParsedArgs) {
    const { matches } = Utils.regex(
      Constants.DiscordRegexNames.TEXT_CODEBLOCK,
      args.code
    );
    if (matches.length) {
      args.code = matches[0]?.text;
    }

    let language = "ts";
    let message;
    try {
      message = await Promise.resolve(tsEval(args.code));
      if (typeof message === "object") {
        message = JSON.stringify(message, null, args.jsonspacing);
        language = "json";
      }
    } catch (error) {
      message = error instanceof Error ? error.stack || error.message : error;
    }
    const limit = 1990 - language.length;
    if (!args.noreply) {
      return context.editOrReply(
        Markup.codeblock(message, { language, limit })
      );
    }
  }
}
async function tsEval(code: string) {
  return await eval(transpile(code));
}
