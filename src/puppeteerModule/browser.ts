import fs from "fs";
import { Page, Browser as PuppeteerBrowser } from "puppeteer";
import { browserConstants } from "../config/constants.js";
import { delay } from "../utils/delay.js";
import { login } from "./start.js";
const { buttonsPost, nextPage, buttonShowMorePosts, followers } =
  browserConstants;
const COOKIES_FILE = "../cookies.json";

export class Browser {
  private browser: PuppeteerBrowser;
  private page: Page | null;
  constructor() {
    this.browser;
    this.page;
  }

  async initializeSession(username, password) {
    const { browser, page } = await login(username, password);
    this.browser = browser;
    this.page = page;
    await Promise.all([this.loadCookies(page), this.saveCookies(page)]);
  }

  async saveCookies(page) {
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
  }

  async loadCookies(page) {
    if (fs.existsSync(COOKIES_FILE)) {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, "utf-8"));
      await page.setCookie(...cookies);
    }
  }

  async close() {
    await this.browser.close();
  }

  //TODO: Passar para classe de Likes
  async likingPosts(amount = 20, hashtag = "") {
    try {
      if (hashtag) {
        await this.page.goto(this.buildUrl("all", "", false, hashtag));
        await delay(5000);
      }

      let count = 0;
      while (true) {
        await this.page.waitForSelector(buttonsPost);
        const buttons = await this.page.$$(buttonsPost);

        for (const button of buttons) {
          if (count >= amount) {
            await this.returnToFeed();
            return;
          }
          await button.click();
          await delay(1000);
          count++;
        }

        await this.page.waitForSelector(buttonShowMorePosts);
        await this.page.click(buttonShowMorePosts);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  //TODO: Passar para classe de Follow
  async actionFollowers(amount = 20, term = "recruiter", category = "people") {
    try {
      const url = this.buildUrl(category, term);
      await this.page.goto(url);
      await delay(5000);

      let count = 0;
      while (true) {
        const buttons = await this.page
          .waitForSelector(followers)
          .then(async () => {
            return await this.page.$$(followers);
          })
          .catch(() => {
            return [];
          });

        console.log(buttons.length);
        for (const button of buttons) {
          if (count >= amount) {
            await this.returnToFeed();
            return;
          }
          await button.click();
          await delay(1000);

          count++;
        }

        await this.page.waitForSelector(nextPage);
        await this.page.click(nextPage);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  //TODO: Passar para classe de Connect
  async connectWithPeoples(amount, term, note = false) {
    try {
      const { connectButton, actions, getName, btnNoSendNote } =
        browserConstants.connect;

      const url = this.buildUrl("people", term, true, "");
      await this.page.goto(url);
      await delay(5000);

      let count = 0;
      while (true) {
        await delay(3000);
        const buttonsOfPeoples = await this.page
          .waitForSelector(connectButton)
          .then(async () => {
            return await this.page.$$(connectButton);
          })
          .catch(() => {
            return [];
          });

        const { btnAddNote, inputNote, btnSendNote } = actions;
        for (const people of buttonsOfPeoples) {
          if (count >= amount) {
            await this.returnToFeed();
            return;
          }

          await delay(1000);
          await people.click();
          await delay(1000);

          if (note) {
            const elemento = await people
              .getProperty("ariaLabel")
              .then((el) => el.jsonValue());
            const name = getName(elemento);

            await this.page.waitForSelector(btnAddNote);
            await this.page.click(btnAddNote);
            await delay(1000);

            const msg = note.replace("{{name}}", name);

            await this.page.waitForSelector(inputNote);
            await this.page.type(inputNote, msg);
            await delay(1000);

            await this.page.waitForSelector(btnSendNote);
            await this.page.click(btnSendNote);
            await delay(1000);
          } else {
            await delay(1000);
            await this.page.waitForSelector(btnNoSendNote);
            await this.page.click(btnNoSendNote);
            await delay(1000);
          }
        }

        // Ir para a próxima página quando não houver mais pessoas para conectar
        await this.page.waitForSelector(nextPage);
        await this.page.click(nextPage);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  async returnToFeed() {
    if (this.page) {
      await this.page.goto("https://www.linkedin.com/feed/");
    }
  }
}
