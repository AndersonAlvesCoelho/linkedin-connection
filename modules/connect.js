import getInput from "../helper/input.js";

async function hasNote() {
  console.clear();
  console.log("Deseja enviar mensagem para as conexões?");
  let needSendNote;
  do {
    needSendNote = false;
    needSendNote = await getInput("S/N: ");
    needSendNote = needSendNote.trim().toLowerCase();
  } while (needSendNote !== "s" && needSendNote !== "n");
  return needSendNote === "s";
}

async function getAmount() {
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
  return amountConnections;
}

async function getNote() {
  console.clear();
  console.log(
    `\nEsreva a mensagem que deseja enviar: Obs.: Use no máximo 200 caracteres\n
    Adicione a chave {{name}} para adicionar o nome do usuário que será conectado\n`
  );
  let note;
  do {
    note = false;
    note = await getInput("Mensagem: ");
    note.trim();
  } while (note === true);
  return note;
}

async function getTermOfSearch() {
  console.clear();
  console.log(
    "Informe o termo de busca. Exemplo: Desenvolvedor, Recrutador, etc."
  );
  let term;
  do {
    term = false;
    term = await getInput("Termo: ");
    term.trim();

    if (term.length < 1) {
      console.log("Termo inválido");
      term = true;
    }
  } while (term === true);
  return term;
}

export async function runConnect(browser) {
  const amount = await getAmount();
  const term = await getTermOfSearch();
  const note = (await hasNote()) ? await getNote() : false;

  await browser.connectWithPeoples(amount, term, note);
}
