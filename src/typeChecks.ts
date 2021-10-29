//This needs optimization, contributions welcome.
// Maybe just subject to one, since we can just assume its going to be one or the other?

export module checkRover {
  export async function ApiResponse(x: object): Promise<boolean> {
    let to3: number = 0;
    if (x.hasOwnProperty("status")) to3++;
    if (x.hasOwnProperty("robloxUsername")) to3++;
    if (x.hasOwnProperty("robloxId")) to3++;
    if (to3 === 3) {
      return true;
    } else return false;
  }

  export async function ApiError(x: object): Promise<boolean> {
    let to3: number = 0;
    if (x.hasOwnProperty("status")) to3++;
    if (x.hasOwnProperty("errorCode")) to3++;
    if (x.hasOwnProperty("error")) to3++;
    if (to3 === 3) {
      return true;
    } else return false;
  }
}

export module checkBloxlink {
  export async function ApiResponse(x: object): Promise<boolean> {
    let to3: number = 0;
    if (x.hasOwnProperty("discordId")) to3++;
    if (x.hasOwnProperty("robloxId")) to3++;
    if (x.hasOwnProperty("robloxUsername")) to3++;
    if (to3 === 3) {
      return true;
    } else return false;
  }

  export async function ApiError(x: object): Promise<boolean> {
    let to2: number = 0;
    if (x.hasOwnProperty("status")) to2++;
    if (x.hasOwnProperty("error")) to2++;
    if (to2 === 2) {
      return true;
    } else return false;
  }
}
