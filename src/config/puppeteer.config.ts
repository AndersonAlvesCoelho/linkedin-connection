import os from "os";
import { PuppeteerLaunchOptions } from "puppeteer";

const DIRCACHE = __dirname + "./cache/.browser";

export function getExecutablePath() {
  const platform = os.platform();

  switch (platform) {
    case "win32":
      return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    case "linux":
      return "/usr/bin/google-chrome";
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    default:
      throw new Error("Unsupported platform");
  }
}

const puppeteerConfig: PuppeteerLaunchOptions = {
  headless: false,
  ignoreDefaultArgs: ["--mute-audio"],
  args: ["--start-maximized"],
  defaultViewport: null,
  executablePath: getExecutablePath(),
  userDataDir: DIRCACHE,
};

export default puppeteerConfig;
