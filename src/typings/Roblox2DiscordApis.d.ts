import HttpStatusCode from "./HttpStatusCode";

export module rover {
  export interface ApiResponse {
    status: string;
    robloxUsername: string;
    robloxId: number;
  }

  export interface ApiError {
    status: string;
    errorCode: HttpStatusCode;
    error: string;
  }
}

export module bloxlink {
  export interface ApiResponse {
    discordId: string;
    robloxId: string;
    robloxUsername: string;
  }

  export interface ApiError {
    status: string;
    error: string;
  }
}
