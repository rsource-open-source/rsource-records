export interface user {
  ID: number;
  Username: string;
  State: 0 | 1 | 2;
  // 0 = normal, 1 = whitelisted, 2 = blacklisted
}
