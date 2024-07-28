import getInput from "./input.js";
import { likingPosts, connectWithPeoples, actionFollowers } from "../puppeteerModule/browser.js"; // Ajuste o caminho conforme necessário
import { applyForJobs } from "../puppeteerModule/applyForJobs.js"; // Ajuste o caminho conforme necessário
export default async function menu() {
  const version = "1.0";

  console.log("----------------------------------------------------------");
  console.log("--------------------- Linkedin connection ----------------");
  console.log(
    `--------------------------- V ${version} ------------------------`
  );
  console.log("\n\nSelecionar opção:\n");
  console.log("1. Realizar curtidas");
  console.log("2. Fazer conexões");
  console.log("3. Seguir");
  console.log("4. Se candidatar");
  console.log("5. Sair");

  let option;
  let validOption;
  do {
    validOption = false;
    option = await getInput("Informe a opção desejada: ");
    option = parseInt(option.trim());

    if (isNaN(option) || option < 1 || option > 5) {
      console.log("Opção inválida");
      validOption = true;
    }
  } while (validOption);

  console.clear();

  let username, password;
  let doLogin;
  do {
    doLogin = false;

    username = await getInput("Informe o login: ");
    password = await getInput("Informe a senha: ");

    if (username.length < 1 || password.length < 1) {
      console.log("Login ou senha inválidos");
      doLogin = true;
    }
  } while (doLogin);

  if (option === 1) {
    await likingPosts(username, password);
  } else if (option === 2) {
    const amount = parseInt(await getInput("Informe a quantidade de conexões: "));
    const term = await getInput("Informe o termo de busca: ");
    const note = await getInput("Deseja enviar uma nota personalizada? (s/n): ");
    const noteText = note.toLowerCase() === 's' ? await getInput("Informe a nota: ") : false;
    await connectWithPeoples(username, password, amount, term, noteText);
  } else if (option === 3) {
    const { browser, page } = await startBrowser();
    await login(page, username, password);
    await actionFollowers(page);
    browser.close();
  } else if (option === 4) {
    const searchTerm = await getInput("Informe o termo de busca de vagas: ");
    const responses = {}; // Aqui você pode adicionar lógica para pegar respostas para questionários, se necessário
    await applyForJobs(username, password, searchTerm, responses);
  } else if (option === 5) {
    console.log("Saindo...");
    process.exit(0);
  }
}
