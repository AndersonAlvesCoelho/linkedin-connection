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

  let doLogin;
  do {
    doLogin = false;

    const username = await getInput("Informe o login: ");
    const password = await getInput("Informe a senha: ");

    if (username.length < 1 || password.length < 1) {
      console.log("Login ou senha inválidos");
      doLogin = true;
    }
  } while (doLogin);

  const isConnections = option === 2;
  if (isConnections) {
    console.clear();

    let needSendNote;
    do {
      needSendNote = false;
      console.log("Deseja enviar mensagem para as conexões?");
      needSendNote = await getInput("S/N: ");

      needSendNote = needSendNote.trim().toLowerCase();
    } while (needSendNote !== "s" && needSendNote !== "n");
    console.clear();

    console.log(
      "Quantas conexões deseja fazer?\nObs.: O máximo de conexões semanal permitida pelo linkedin é de 250 conexões\n"
    );
    let amountConnections;
    do {
      amountConnections = await getInput("Quantidade de conexões: ");
      amountConnections = parseInt(amountConnections.trim());
      if (
        isNaN(amountConnections) ||
        amountConnections < 1 ||
        amountConnections > 250
      ) {
        console.log("Quantidade inválida");
        amountConnections = true;
      }
      break;
    } while (amountConnections);

    console.clear();
    console.log(
      `\nEsreva a mensagem que deseja enviar: Obs.: Use no máximo 200 caracteres`
    );

    let note;
    do {
      note = false;
      note = await getInput("Mensagem: ");
      note.trim();

      if (note.length > 200) {
        console.log("Mensagem muito grande");
        note = true;
      }
    } while (note === true);

    return { option, username, password, amountConnections, note };
  }

  return { option, username, password };
}
