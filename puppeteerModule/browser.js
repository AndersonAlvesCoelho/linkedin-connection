import { browserConstants } from "../config/constants.js";

import { delay } from "../helper/delay.js";
import { login, startBrowser } from "./start.js";
const { buttonsPost, buttonPlusPost, followers } = browserConstants;

function buildUrl(
  category = "all", // all, people, companies
  search = "tech recruiter", // tech recruiter
  hiring = true, // true or false
  hashtag = "techrecruiter" // #techrecruiter
) {
  if (search)
    return `https://www.linkedin.com/search/results/${
      category + "/"
    }?keywords=${search}&activelyHiring="${hiring}"`;

  return `https://www.linkedin.com/feed/hashtag/${hashtag}/`;
}

export default async function likingPosts(username, password, hashtag = "") {
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
    let countConnected = 0;
    const { nextPage } = browserConstants;
    const { url, connectButton, actions, getName, btnNoSendNote } =
      browserConstants.connect;

    await login(page, username, password);
    await delay(5000);

    await page.goto(url.replace("{{term}}", term));
    await delay(5000);

    while (countConnected <= amount) {
      await delay(3000);
      await page.waitForSelector(connectButton);
      const buttonsOfPeoples = await page.$$(connectButton);

      const { btnAddNote, inputNote, btnSendNote } = actions;
      for (let people of buttonsOfPeoples) {
        await delay(1000);
        await people.click();
        await delay(1000);

        if (note) {
          const elemento = await people
            .getProperty("ariaLabel")
            .then((el) => el.jsonValue());
          const name = getName(elemento);

          await page.waitForSelector(btnAddNote);
          await page.click(btnAddNote);
          await delay(1000);

          const msg = note.replace("{{name}}", name);
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

        countConnected++;
        if (countConnected > amount) {
          break;
        }
      }

      // Ir para a próxima página quando não houver mais pessoas para conectar
      await page.waitForSelector(nextPage);
      await page.click(nextPage);
      await delay(5000);
    }
    browser.close();
  } catch (err) {
    console.error("Err: ", err);
  }
}

export { actionFollowers, buildUrl, connectWithPeoples };
// Olá! Sou Willian, desenvolvedor com 5+ anos de experiência. Aceite meu convite! 😉 Conectar com você seria ótimo. Se precisar de um desenvolvedor experiente em Python, NodeJs e APIs, estou pronto para novas oportunidades. Obrigado! Meu WhatsApp: wa.me/5561983244927
