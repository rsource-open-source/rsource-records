export enum UserState {
  NORMAL,
  WHITELISTED,
  BLACKLISTED
}
export interface User {
  ID: number;
  Username: string;
  State: UserState;
}
