import configData from "./config.json";

export const envConfig = {
  baseUrl: process.env.BASE_URL || configData.baseUrl,
  defaultTimeout:
    Number(process.env.DEFAULT_TIMEOUT) || configData.defaultTimeout,
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || configData.actionTimeout,
  navigationTimeout:
    Number(process.env.NAV_TIMEOUT) || configData.navigationTimeout,
  pollingTimeout:
    Number(process.env.POLLING_TIMEOUT) || configData.pollingTimeout,
  pollingInterval:
    Number(process.env.POLLING_INTERVAL) || configData.pollingInterval,
  isHeadless: process.env.HEADLESS
    ? process.env.HEADLESS !== "false"
    : configData.headless,
};
