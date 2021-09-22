import HttpStatusCode from "./HttpStatusCode";
//https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45
//https://api.strafes.net/v1

export enum ApiErrorMessages {
  /**
   * This string returns when no API key is found or given.
   */
  NOAPIKEY = "No API key found in request",

  /**
   * This returns when the given API key is invalid, this means
   * either the key has been suspended/revoked, not an API key,
   * or typed wrong. This returns a 401 HTTP code.
   */
  INVAPIKEY = "Invalid authentication credentials",

  /**
   * The inputed value cannot be found or matched in the API Database.
   * This returns a 404 HTTP code.
   */
  NOTFOUND = "Not Found",
}

export enum GameID {
  BHOP = 1,
  SURF = 2,
}

export enum StyleID {
  AUTOHOP = 1,
  SCROLL = 2,
  SIDEWAYS = 3,
  HALF_SIDEWAYS = 4,
  W_ONLY = 5,
  A_ONLY = 6,
  BACKWARDS = 7,
}

/**
 * For more information about this:
 * @see {@link https://wiki.strafes.net/moderation#:~:text=r9restaurant-,The%20Moderation%20Process,-There%20are%20four}
 */
export enum UserState {
  NORMAL = 0,
  WHITELISTED = 1,
  BLACKLISTED = 2,
  PENDING = 3,
}

/**
 * An error has occured! This is what it would look like.
 */
export interface ApiError {
  readonly code?: HttpStatusCode;
  readonly message: ApiErrorMessages;
  /**
   * A UUID for tracing errors (idfk what this is)
   */
  readonly reference?: string;
}

export interface User {
  /**
   * Roblox user ID.
   * https://www.roblox.com/users/{ID}/profile
   */
  readonly ID: number;
  readonly Username: string;
  readonly State: UserState;
}

/**
 * API Description: If a new time is made it will retain the previous time's id.
 */
export interface Time {
  /**
   * Time ID, you cannot get this in-game.
   */
  readonly ID: number;
  /**
   * Time, in milliseconds, remember to multiple this value by 1000 for it's true value.
   */
  readonly Time: number;
  /**
   * Roblox user ID.
   * https://www.roblox.com/users/{ID}/profile
   */
  readonly User: number;
  /**
   * Map ID.
   */
  readonly Map: number;
  /**
   * ## READ
   * This returns a **number**, to use as a date, use it as a paramater
   * into a date function.
   * This is a UNIX Epoch number, meaning:
   * Represents the number of seconds that have elapsed since the
   * midnight of January 1, 1970, UTC.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
   */
  readonly Date: number;
  readonly Style: StyleID;
  /**
   * @itzaname what the fuck is this
   */
  readonly Mode: number;
  readonly Game: GameID;
}

export interface Rank {
  readonly ID: number;
  readonly User: number;
  readonly Style: number;
  readonly Mode: number;
  readonly Game: number;
  readonly Rank: number;
  readonly Skill: number;
  readonly Placement: number;
}

export interface Map {
  /**
   * Map model ID.
   */
  readonly ID: number;
  /**
   * The string that you see when selecting on the rtv command.
   */
  readonly DisplayName: string;
  /**
   * Model owner
   */
  readonly Creator: string;
  readonly Game: GameID;
  /**
   * ## READ
   * This returns a **number**, to use as a date, use it as a paramater
   * into a date function.
   * This is a UNIX Epoch number, meaning:
   * Represents the number of seconds that have elapsed since the
   * midnight of January 1, 1970, UTC.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
   */
  readonly Date: number;
  readonly PlayCount: number;
}
