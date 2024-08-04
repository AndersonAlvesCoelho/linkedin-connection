import { Browser, Page } from "puppeteer";
import { browserConstants } from "../config/constants.js";
import { buildUrl } from "../utils/build-urls.js";
import { delay, delayRandom } from "../utils/delay.js";
import { getInputNumber, getInputText } from "../utils/input.js";

const { like: LIKE, pages: PAGES } = browserConstants;
class LikeModule {
  private browser: Browser;
  private page: Page;
  constructor(page: Page, browser: Browser) {
    this.page = page;
    this.browser = browser;
  }

  async getAmount() {
    console.clear();
    console.log(
      "Quantidade de Posts que deseja curtir. Máximo: 250\nValor padrão: 20"
    );

    while (true) {
      const amount = await getInputNumber("Quantidade: ", 20);
      if (amount < 1 || amount > 250) {
        console.log("Quantidade inválida");
        continue;
      }
      return amount;
    }
  }

  async getHashtag() {
    console.clear();
    console.log(
      "Informe a hashtag que deseja buscar.\n" +
        "Exemplo: python, javascript, node, etc."
    );
    let hashtag = await getInputText("Hashtag: ", true);

    if (hashtag.length < 1) {
      return "";
    }
    return hashtag;
  }

  async likingPosts(amount = 20, hashtag = "") {
    try {
      if (hashtag) {
        await this.page.goto(buildUrl("", "", hashtag));
        await delay(5000);
      }

      let count = 0;
      while (true) {
        await this.page.waitForSelector(LIKE.btnsOfPost);
        const buttons = await this.page.$$(LIKE.btnsOfPost);

        for (const button of buttons) {
          if (count >= amount) {
            return;
          }
          await button.click();
          await delay(800);
          count++;
        }

        await this.page.waitForSelector(LIKE.btnShowMorePosts);
        await this.page.click(LIKE.btnShowMorePosts);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  async run() {
    const [amount, hashtag] = await Promise.all([
      this.getAmount(),
      this.getHashtag(),
    ]);

    await this.likingPosts(amount, hashtag);
    await delayRandom(500, 1000);
    await this.page.goto(PAGES.feed);
  }
}

export default LikeModule;
