import HttpStatusCode from "./HttpStatusCode";
//https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45
//https://api.strafes.net/v1

export enum ApiErrorMessages {
  /**
   * This string returns when no API key is found or given.
   */
  NO_API_KEY = "No API key found in request",

  /**
   * This returns when the given API key is invalid, this means
   * either the key has been suspended/revoked, not an API key,
   * or typed wrong. This returns a 401 HTTP code.
   */
  INVALID_API_KEY = "Invalid authentication credentials",

  /**
   * The inputed value cannot be found or matched in the API Database.
   * This returns a 404 HTTP code.
   */
  NOT_FOUND = "Not Found",

  BAD_REQUEST = "Bad Request",
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
   * A UUID for tracing errors (idfk what this is).
   */
  readonly reference?: string;
}

export interface User {
  /**
   * Roblox user ID.
   * https://www.roblox.com/users/{ID}/profile
   */
  readonly id: number;
  readonly username: string;
  readonly state: UserState;
}

/**
 * API Description: If a new time is made it will retain the previous time's id.
 */
export interface Time {
  /**
   * Time ID, you cannot get this in-game.
   */
  readonly id: number;
  /**
   * Time, in milliseconds, remember to multiple this value by 1000 for it's true value.
   */
  readonly time: number;
  /**
   * Roblox user ID.
   * https://www.roblox.com/users/{ID}/profile
   */
  readonly user: number;
  /**
   * Map ID.
   */
  readonly map: number;
  /**
   * ## READ
   * This returns a **number**, to use as a date.
   * This is a UNIX Epoch number.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
   */
  readonly date: number;
  readonly style: StyleID;
  /**
   * @itzaname what the fuck is this.
   */
  readonly mode: number;
  readonly game: GameID;
}

export interface Rank {
  /**
   * Rank ID.
   * > There are multiple ranks per user so using the same id for each one would be kinda wack
   * From itzaname.
   */
  readonly id: number;
  /**
   * Roblox user ID.
   * https://www.roblox.com/users/{ID}/profile
   */
  readonly user: number;
  readonly style: StyleID;
  /**
   * @itzaname what the fuck is this.
   */
  readonly mode: number;
  readonly game: GameID;
  /**
   * 1 being the top.
   */
  readonly rank: number;
  /**
   * Skill percentage to the 15th digit, 0-1.
   */
  readonly skill: number;
  /**
   * Placement worldwide, 1 being the top.
   */
  readonly placement: number;
}

export interface Map {
  /**
   * Map model ID.
   */
  readonly id: number;
  /**
   * The string that you see when selecting on the rtv command.
   */
  readonly displayName: string;
  /**
   * Model owner.
   */
  readonly dreator: string;
  readonly game: GameID;
  /**
   * ## READ
   * This returns a **number**, to use as a date, use it as a paramater
   * into a date function.
   * This is a UNIX Epoch number, meaning:
   * Represents the number of seconds that have elapsed since the
   * midnight of January 1, 1970, UTC.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
   */
  readonly date: number;
  readonly playCount: number;
}
