import { browserConstants } from "../config/constants.js";

import { delay } from "../helper/delay.js";
import { login, startBrowser } from "./start.js";
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

export default async function likingPosts(username, password) {
  const { browser, page } = await startBrowser();

  try {
    await login(page, username, password);
    await delay(5000);

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
  browser.close();
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

async function connectWithPeoples(
  username,
  password,
  amount,
  term,
  note = false
) {
  try {
    const { browser, page } = await startBrowser();
    let countConected = 0;
    const { nextPage } = browserConstants;
    const { url, connectButton, actions, getName, btnNoSendNote } =
      browserConstants.connect;

    await login(page, username, password);
    await delay(5000);

    await page.goto(url.replace("{{term}}", term));
    await delay(5000);

    while (true) {
      let elemento, name, msg;
      await page.waitForSelector(connectButton);
      const buttonsOfPeoples = await page.$$(connectButton);

      const { btnAddNote, inputNote, btnSendNote } = actions;
      for (let people of buttonsOfPeoples) {
        await delay(1000);
        await people.click();
        await delay(1000);

        if (note) {
          elemento = await people
            .getProperty("ariaLabel")
            .then((el) => el.jsonValue());
          name = getName(elemento);

          await page.waitForSelector(btnAddNote);
          await page.click(btnAddNote);
          await delay(1000);

          // olá, {{name}}! Vamos nos conectar? Obs.: Sou uma automação em período de teste.
          msg = note.replace("{{name}}", name);
          console.log("msg: ", msg);
          await page.waitForSelector(inputNote);
          await page.type(inputNote, msg);
          await delay(1000);

          await page.waitForSelector(btnSendNote);
          await page.click(btnSendNote);
          await delay(1000);
        } else {
          await delay(1000);
          await page.waitForSelector(btnNoSendNote);
          await page.click(btnNoSendNote);
          await delay(1000);
        }

        countConected++;
        if (countConected === amount) {
          break;
        }
      }
      if (countConected === amount) {
        break;
      }
    }
    browser.close();
  } catch (err) {
    console.error("Err: ", err);
  }
}

export { actionFollowers, buildUrl, connectWithPeoples };
