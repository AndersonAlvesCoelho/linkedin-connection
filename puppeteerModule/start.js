import puppeteer from "puppeteer";
import puppeteerConfig from "../config/puppeteer.config.mjs";

import { delay } from '../helper/delay.js'
import { browserConstants } from "../config/constants.js"

const { submitLogin } = browserConstants;

async function startBrowser() {
  try {
    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();
    return { browser, page };
  } catch (error) {
    throw new Error(`Ocorreu um erro - startBrowser: ${error.message}`);
  }
}

async function login(page, username, password) {
  try {
    await page.type("input[id=username]", username);
    await page.type("input[id=password]", password);
    await delay(1000);
    await page.click(submitLogin);

    await delay(3000);
  } catch (error) {
    throw new Error(`Ocorreu um erro - login: ${error.message}`);
  }
}

export { startBrowser, login };
