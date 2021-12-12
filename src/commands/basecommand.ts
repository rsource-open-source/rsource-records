import { Command } from "detritus-client";

export class BaseCommand<
  ParsedArgsFinished = Command.ParsedArgs
> extends Command.Command<ParsedArgsFinished> {
  triggerTypingAfter = 1000;

  async onRunError(ctx: Command.Context) {
    (await ctx.channel?.fetchMessage(ctx.messageId))!.edit(
      `An error occurred, this has been repoted to the developers, sorry for the inconvenience.`
    );
  }

  onTypeError(
    ctx: Command.Context,
    args: ParsedArgsFinished,
    errors: Command.ParsedErrors
  ) {
    ctx.reply(
      `An error occurred: ${
        Array.isArray(errors) ? errors.join("\n") : errors
      }\nWith these arguments: ${args}`
    );
    console.log(errors, args);
  }
}
