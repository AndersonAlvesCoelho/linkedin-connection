import fs from "fs";
import { Browser } from "./puppeteerModule/browser.js";
const CREDENTIALS_FILE = "credentials.json";
const COOKIES_FILE = "cookies.json";

import getInput from "./helper/input.js";
import { runConnect } from "./modules/connect.js";
import { runFollow } from "./modules/follow.js";
import { runLike } from "./modules/like.js";

const browser = new Browser();

function saveCredentials(username, password, save = "n") {
  if (save.toLowerCase() === "n") {
    return { username, password };
  }
  credentials = { username, password };
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials));
  return credentials;
}

function getListOfCredentials() {
  return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));
}

getListOfCredentials();
async function getOptionCredentials() {
  const credentials = await console.log("Selecione a conta que deseja usar:");
  console.log("");
  credentials.forEach((credential, index) => {
    console.log(`${index + 1}. ${credential.username}`);
  });
  console.log("");
  const option = await getInput("Opção: ", true, null, true);
  return credentials[option - 1];
}

async function showMenuOfLogin() {
  console.clear();
  console.log("----------------------------------------------------------");
  console.log("---------------- LOGIN - Linkedin connection -------------");
  console.log("------------------------- V 1.0 --------------------------");
  console.log("");
  console.log("1. Iniciar nova sessão. [Padrão]");
  console.log("2. Usar credenciais salvas");
  console.log("3. Sair");
  console.log("");
  return await getInput("Opção: ", true, 1);
}

function askCredentials(callback) {
  const username = getInput("Email: ");
  const password = getInput("Senha: ", null, true);
  const save = getInput("Deseja salvar as credenciais? (s/[N]): ", "n");
}

async function startSession(
  username,
  password,
  savedLoginOptions,
  newSession = false
) {
  if (options && newSession === true) {
    await browser.initializeSession(username, password);
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
    option = await getInput("Opção: ", true);
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
      await browser.close();
      return;
  }
  await doAgain();
}

async function login() {
  let option = await showMenuOfLogin();
  let credentials;
  switch (option) {
    case "1":
      let username = await getInput("Email: ");
      let password = await getInput("Senha: ", null, true);
      let save = await getInput("Deseja salvar as credenciais? (s/[N]): ", "n");
      credentials = saveCredentials(username, password, save);
      break;
    case "2":
      credentials = getOptionCredentials();
      break;
    case "3":
      console.log("Saindo...");
      process.exit(0);
  }
  await startSession(
    credentials.username,
    credentials.password,
    option === "2"
  );
  return;
}

(async () => {})();
