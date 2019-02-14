require('dotenv').config();

export const API_ID = process.env.API_ID;
export const API_HASH =  process.env.API_HASH;
export const MONGODB = process.env.MONGODB;

export enum postTypes {
  vacancy = "Vacancy",
  resume = "Resume",
}

export enum dateRanges {
  lastDay = "Last day",
  lastThreeDays = "Last 3 days",
  lastWeek = "Last week",
  lastMonth = "Last month",
  allPeriod = "All period",
}

export const JSJOBS_CHANNEL_ID = -1001110946746;
