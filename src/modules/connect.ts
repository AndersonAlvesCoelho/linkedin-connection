import getInput from "../utils/input.js";

class Connect {
  constructor(browser) {
    this.browser = browser;
  }

  async hasNote() {
    console.clear();
    console.log("Deseja enviar mensagem para as conexões?");
    let needSendNote;
    while (true) {
      needSendNote = await getInput("[S]/N: ");
      needSendNote = needSendNote.trim().toLowerCase();
      if (["s", "n"].includes(needSendNote)) {
        break;
      }
      console.clear();
      console.log("Opção inválida, tente novamente.");
    }
    return needSendNote === "s";
  }

  async getAmount() {
    console.clear();
    console.log(
      "Quantas conexões deseja fazer?\nObs.: O máximo de conexões semanal permitida pelo linkedin é de 250 conexões\n"
    );
    let amountConnections;
    while (true) {
      amountConnections = await getInput("Quantidade de conexões: ");
      amountConnections = parseInt(amountConnections.trim());
      if (
        !isNaN(amountConnections) &&
        amountConnections >= 1 &&
        amountConnections <= 250
      ) {
        break;
      }
      console.log("Quantidade inválida, tente novamente.");
    }
    return amountConnections;
  }

  async getNote() {
    console.clear();
    console.log(
      `\nEscreva a mensagem que deseja enviar: Obs.: Use no máximo 200 caracteres\n
      Adicione a chave {{name}} para adicionar o nome do usuário que será conectado\n`
    );
    let note;
    while (true) {
      note = await getInput("Mensagem: ");
      note = note.trim();
      if (note.length > 0 && note.length <= 200) {
        break;
      }
      console.log("Mensagem inválida, tente novamente.");
    }
    return note;
  }

  async getTermOfSearch() {
    console.clear();
    console.log(
      "Informe o termo de busca. Exemplo: Desenvolvedor, Recrutador, etc."
    );
    let term;
    while (true) {
      term = await getInput("Termo: ");
      term = term.trim();
      if (term.length > 0) {
        break;
      }
      console.log("Termo inválido, tente novamente.");
    }
    return term;
  }

  async runConnect() {
    const amount = await this.getAmount();
    const term = await this.getTermOfSearch();
    const note = (await this.hasNote()) ? await this.getNote() : "";

    await this.browser.connectWithPeoples(amount, term, note);
  }
}

export default Connect;
