//import { checkRover } from "../typeChecks";
import { HTTPStatusCodes } from "detritus-rest/lib/constants";

export module rover {
  export class ApiResponse {
    status!: string;

    constructor(response: any) {
      this.status = response!.status;
    }
  }

  export class ApiResolve extends ApiResponse {
    robloxUsername!: string;
    robloxId!: number;

    constructor(response: any) {
      super(response);
      this.robloxUsername = response.robloxUsername;
      this.robloxId = response.robloxId;
    }
  }

  export class ApiError extends ApiResponse {
    errorCode!: HTTPStatusCodes;
    error!: string;

    constructor(response: any) {
      super(response);
      this.errorCode = response.errorCode;
      this.error = response.error;
    }
  }
}

export module bloxlink {
  export class ApiResponse {
    status!: "ok" | "error";
    constructor(response: any) {
      this.status = response!.status;
    }
  }

  export class ApiResolve extends ApiResponse {
    primaryAccount!: string;
    matchingAccount!: string | null;

    constructor(response: any) {
      super(response);
      this.primaryAccount = response!.primaryAccount;
      this.matchingAccount = response!.matchingAccount;
    }
  }

  export class ApiError extends ApiResponse {
    error!: string | null;

    constructor(response: any) {
      super(response);
      this.error = response!.error;
    }
  }
}

export module roblox {
  export class ApiResolve {
    Id!: number;
    Username!: string;
    //Depricated in docs?
    AvatarUri!: null | any; //idk what this is but i know it can be null
    AvatarFinal!: boolean;
    IsOnline!: boolean;

    constructor(response: any) {
      this.Id = response.Id;
      this.Username = response.Username;
      //Depricated in docs?
      this.AvatarUri = response.AvatarUri;
      this.AvatarFinal = response.AvatarFinal;
      this.IsOnline = response.IsOnline;
    }
  }

  export class ApiError {
    errors!: [
      {
        code: HTTPStatusCodes;
        message: string;
      }
    ];

    constructor(response: any) {
      this.errors = response.errors;
    }
  }
}
