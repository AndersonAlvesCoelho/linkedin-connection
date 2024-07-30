import fs from "fs";
import readline from "readline";
import { Browser } from "./puppeteerModule/browser.js";
const CREDENTIALS_FILE = "credentials.json";
const COOKIES_FILE = "cookies.json";

import getInput from "./helper/input.js";
import { runConnect } from "./modules/connect.js";
import { runFollow } from "./modules/follow.js";
import { runLike } from "./modules/like.js";

let credentials = {
  username: "",
  password: "",
};
const browser = new Browser();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function saveCredentials(username, password) {
  credentials.username = username;
  credentials.password = password;
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials));
}

function loadCredentials() {
  if (fs.existsSync(CREDENTIALS_FILE)) {
    const savedCredentials = JSON.parse(
      fs.readFileSync(CREDENTIALS_FILE, "utf-8")
    );
    credentials.username = savedCredentials.username;
    credentials.password = savedCredentials.password;
  }
}

function askCredentials(callback) {
  rl.question("Digite o usuário: ", (username) => {
    rl.question("Digite a senha: ", (password) => {
      saveCredentials(username, password);
      callback();
    });
  });
}

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
}

async function loadCookies(page) {
  if (fs.existsSync(COOKIES_FILE)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, "utf-8"));
    await page.setCookie(...cookies);
  }
}

async function startSession() {
  if (credentials.username && credentials.password) {
    await browser.initializeSession(credentials.username, credentials.password);
    showMenu();
  } else {
    askCredentials(async () => {
      await browser.initializeSession(
        credentials.username,
        credentials.password
      );
      showMenu();
    });
  }
}

async function showMenu() {
  console.clear();
  console.log("----------------------------------------------------------");
  console.log("--------------------- Linkedin connection ----------------");
  console.log("--------------------------- V 1.0 ------------------------");
  console.log("");
  console.log("Selecionar opção:");
  console.log("");
  console.log("1. Realizar curtidas");
  console.log("2. Fazer conexões");
  console.log("3. Seguir");
  console.log("4. Sair");
  console.log("");

  // tentar pegar a opção do usuário até que seja válida
  let options = ["1", "2", "3", "4"];
  let option;
  while (true) {
    option = false;
    option = await getInput("Opção: ");
    option = option.trim();
    if (options.includes(option)) {
      break;
    }
    console.log("Opção inválida");
  }
  await handleOption(option);
  return;
}

async function doAgain() {
  await rl.question("Deseja realizar outra ação? (s/n): ", async (answer) => {
    answer = answer.trim().toLowerCase();
    if (answer === "s") {
      await showMenu();
    } else {
      console.log("Saindo...");
      rl.close();
      await browser.close();
      process.exit(0);
    }
  });
  return;
}

async function handleOption(option) {
  switch (option) {
    case "1":
      console.clear();
      await runLike(browser);
      break;
    case "2":
      console.clear();
      await runConnect(browser);
      break;
    case "3":
      console.clear();
      await runFollow(browser);

      break;
    case "4":
      console.log("Saindo...");
      rl.close();
      await browser.close();
      return;
  }
  await doAgain();
}

loadCredentials();

(async () => {
  await startSession();
})();
