
import { browserConstants } from "../config/constants.js"

const { buttonsPost, buttonPlusPost } = browserConstants

export default async function likingPosts(page) {
  try {
    while (true) {
      await page.waitForSelector(buttonsPost);

      const buttons = await page.$$(buttonsPost);

      for (let i = 0; i < buttons.length; i++) {
        await buttons[i].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    }
  } catch (err) {
    console.error("Err: ", err);
  }
}