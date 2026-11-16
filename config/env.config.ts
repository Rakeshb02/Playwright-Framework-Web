import configData from "./config.json";

export const envConfig = {
  baseUrl: process.env.BASE_URL || configData.baseUrl,
  defaultTimeout:
    Number(process.env.DEFAULT_TIMEOUT) || configData.defaultTimeout,
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || configData.actionTimeout,
  navigationTimeout:
    Number(process.env.NAV_TIMEOUT) || configData.navigationTimeout,
  isHeadless: process.env.HEADLESS
    ? process.env.HEADLESS !== "false"
    : configData.headless,
};
