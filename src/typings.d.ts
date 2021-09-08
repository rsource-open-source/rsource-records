declare module "SNtypings" {
  //Note: enum properties 'none' are present because nothing returns on that value: 0, so dont use it.
  //https://api.strafes.net/
  //Intended for v1 (v1 is main)

  //wip
  //nts: make methods
  export enum GameID {
    none,
    BHOP,
    SURF,
  }

  export enum StyleID {
    none,
    AUTOHOP,
    SCROLL,
    SIDEWAYS,
    HALF_SIDEWAYS,
    W_ONLY,
    A_ONLY,
    BACKWARDS,
  }

  export enum UserState {
    NORMAL,
    WHITELISTED,
    BLACKLISTED,
  }

  export interface ApiError {
    readonly code: number; //http code, https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    readonly message: string;
    readonly reference: string;
  }

  export interface User {
    readonly ID: number;
    readonly Username: string;
    readonly State: UserState;
  }

  export interface Time {
    //description: If a new time is made it will retain the previous time's id.
    readonly ID: number;
    readonly Time: number;
    readonly User: number;
    readonly Map: number;
    readonly Date: number;
    readonly Style: number;
    readonly Mode: number;
    readonly Game: GameID; //?
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
}
