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
export function bitfieldToArray<T>(bitfield: number | bigint, array: T[]): T[];
export function bitfieldToArray(bitfield: number | bigint, array: any[]): any[];
export function bitfieldToArray(bitfield: number | bigint, array: any[]) {
  bitfield = BigInt(bitfield);
  return array.filter((_, i) => {
    const current = BigInt(1 << i);
    return ((bitfield as bigint) & current) === current;
  });
}
export const REMOVE_REGEX = /_/g;
export const CAPITALIZE_REGEX = /(^|[ ])./g;
export function capitalizeWords(s: string): string {
  return s
    .replace(REMOVE_REGEX, " ")
    .replace(CAPITALIZE_REGEX, (e) => e.toUpperCase());
}
export function removeCamelCase(s: string): string {
  return s
    .replace(/^./g, (m) => m.toUpperCase())
    .replace(/[A-Z]/g, " $&")
    .substr(1);
}

export function optionalBrackets(optional: boolean = false) {
  return !optional
    ? {
        left: "[",
        right: "]",
      }
    : {
        left: "<",
        right: ">",
      };
}
export const max = (array: number[]) => Math.max(...array);
export const min = (array: number[]) => Math.min(...array);
export const fillArrayWithBounds = (min: number, max: number) => {
  min = min === (Infinity || NaN) ? 0 : min;
  max = max === (Infinity || NaN) ? 100 : max;
  const res = [];
  for (let i = min; i < max; i++) res.push(i);
  return res;
};
export const isConsecutive = (array: number[]) =>
  fillArrayWithBounds(min(array), max(array)).every((e) => !array.includes(e));
[...Array(100).keys()].map((i) => i + (i + 1)).join(", ");
export function generateUsage(command: Command.Command) {
  const flags = formatArgs(command.argParser.args ?? []);
  const args = formatArgs([command.arg] ?? []);
  return `${commandClient.prefixes.custom.first() ?? "!"}${
    command.name
  } ${args.join(" ")} ${flags.join(" ")}`;
}
function formatArgs(args: Command.Argument[] | Command.ArgumentOptions[]) {
  return args.map((v: Command.Argument | Command.ArgumentOptions) => {
    var type: ArgumentType | undefined = v.type;

    if (v.choices && v.choices.every((v) => !isNaN(parseFloat(v))))
      if (v.choices.includes(Infinity))
        type = `${min(v.choices) === Infinity ? 0 : min(v.choices)} ..`;
      else if (isConsecutive(v.choices))
        type = `${min(v.choices)}..${max(v.choices)}`;

    if (v.choices && v.choices.every((v) => typeof v === "string"))
      type = v.choices.join("|");
    var required = v.required;
    if (v.type === "bool") {
      required = false;
      type = undefined;
    }
    const brackets = optionalBrackets(required);
    return `${brackets.left}${
      (v.prefixes instanceof Set ? Array.from(v.prefixes) : v.prefixes) ?? "-"
    }${v.name}${type ? `: ${v.consume ? "..." : ""}${type}` : ""}${
      brackets.right
    }`;
  });
}
