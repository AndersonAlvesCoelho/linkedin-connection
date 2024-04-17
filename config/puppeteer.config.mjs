import os from "os";

const getExecutablePath = () => {
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
};

const puppeteerConfig = {
  headless: false,
  ignoreDefaultArgs: ["--mute-audio"],
  args: ["--no-sandbox", "--disable-web-security"],
  executablePath: getExecutablePath(),
};

export default puppeteerConfig;
