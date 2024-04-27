import { browserConstants } from "../config/constants.js";

import { delay } from "../helper/delay.js";

const { buttonsPost, buttonPlusPost, followers } = browserConstants;

function buildUrl(
  category, // all, people, companies
  search, // tech recruiter
  hiring, // true or false
  hashtag // #techrecruiter
) {
  if (search)
    return `https://www.linkedin.com/search/results/${category}/?keywords=${search}&activelyHiring="${hiring}"`;

  return `https://www.linkedin.com/feed/hashtag/${hashtag}/`;
}

export default async function likingPosts(page) {
  try {
    while (true) {
      await page.waitForSelector(buttonsPost);

      const buttons = await page.$$(buttonsPost);

      for (let i = 0; i < buttons.length; i++) {
        await buttons[i].click();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (err) {
    console.error("Err: ", err);
  }
}

async function actionFollowers(page) {
  try {
    await page.waitForSelector(followers);

    const buttons = await page.$$(followers);

    for (let follower of buttons) {
      await follower.click();
      delay(1000);
    }
  } catch (err) {
    console.error("Err: ", err);
  }
}

async function connectWithPeople(page, sendNote = false) {
  try {
    while (true) {
      await page.waitForSelector(buttonPlusPost);

      const buttons = await page.$$(buttonPlusPost);

      for (let i = 0; i < buttons.length; i++) {
        await buttons[i].click();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (err) {
    console.error("Err: ", err);
  }
}
