import puppeteer from "puppeteer";
import puppeteerConfig from "../config/puppeteer.config.mjs";

import { browserConstants } from "../config/constants.js";
import { delay } from "../helper/delay.js";

const { submitLogin, url } = browserConstants;

async function startBrowser() {
  try {
    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();

    const { width, height } = await page.evaluate(() => {
      return {
        width: window.screen.availWidth,
        height: window.screen.availHeight,
      };
    });

    await page.setViewport({ width, height });
    await page.goto(url);

    return { browser, page };
  } catch (error) {
    throw new Error(`Ocorreu um erro - startBrowser: ${error.message}`);
  }
}

async function login(username, password) {
  try {
    const { browser, page } = await startBrowser();
    await page.type("input[id=username]", username);
    await page.type("input[id=password]", password);
    await delay(1000);
    await page.click(submitLogin);
    await delay(5000);
    await delay(3000);
    return { browser, page };
  } catch (error) {
    throw new Error(`Ocorreu um erro - login: ${error.message}`);
  }
}

export { login, startBrowser };
