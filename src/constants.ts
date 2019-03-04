export const PRODUCTION = process.env.NODE_ENV === "production";
export const POSTS_LIMIT = 100;

if (!PRODUCTION) {
  /* tslint:disable */ require("dotenv").config(); /* tslint:enable */
}

export const API_ID = process.env.API_ID;
export const API_HASH =  process.env.API_HASH;
export const MONGODB = process.env.MONGODB;

export enum postTypes {
  vacancy = "Vacancy",
  resume = "Resume",
  all = "All",
}

export const JSJOBS_CHANNEL_ID = -1001110946746;
