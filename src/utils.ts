import { Command, ShardClient } from "detritus-client";
import { ArgumentType } from "detritus-client/lib/command";
import { commandClient } from ".";

export async function errorToLogs(err: Error, shardClient: ShardClient) {
  await shardClient.rest.createMessage("771779440342466580", {
    embed: {
      color: 0xff3826,
      title: `Error caught`,
      description: `\`\`\`${Date.now()}\n${err.message}\`\`\``,
    },
  });
}

export const numregex = /^\d+$/;

export function inJson(z: object | string): string {
  if (typeof z === "string") z = JSON.stringify(z);
  return `\`\`\`json\n${z}\`\`\``;
}
