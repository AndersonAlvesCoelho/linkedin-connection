import menu from "./helper/menu.js"
import { login, startBrowser } from "./puppeteerModule/start.js"

import { browserConstants } from "./config/constants.js"
import { delay } from "./helper/delay.js";
import likingPosts from "./puppeteerModule/browser.js";

const { url } = browserConstants;

async function main() {
  const { option, username, password } = await menu()
  const { browser, page } = await startBrowser()

  await page.goto(url);
  await login(page, username, password)
  await delay(5000);

  switch (parseInt(option)) {
    case 1:
      await likingPosts(page)
      break;
    case 2:
      // await likingPosts()
      break;
    default:
      console.log("Não existe essa opção");
  }
  await browser.close();

}



main()