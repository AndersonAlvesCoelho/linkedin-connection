import getInput from "./input.js";

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
  console.log("4. Sair");

  let option;
  let validOption;
  do {
    validOption = false;
    option = await getInput("Informe a opção desejada: ");
    option = parseInt(option.trim());

    if (isNaN(option) || option < 1 || option > 4) {
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

  return { option, username, password };
}
