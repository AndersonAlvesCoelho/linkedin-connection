import getInput from "../helper/input.js";

async function getAmount() {
  console.clear();
  console.log(
    "Quantidade de pessoas que deseja seguir. Maximo: 250" +
      "\nValor padrão: 20"
  );
  let amount;
  while (true) {
    amount = false;
    amount = await getInput("Quantidade: ");
    amount = parseInt(amount.trim());
    if (isNaN(amount) || amount < 1 || amount > 250) {
      console.log("Quantidade inválida");
      continue;
    }
    return amount;
  }
}

async function getTerm() {
  console.clear();
  console.log(
    "Informe o termo de busca. Exemplo: Desenvolvedor, Recrutador, etc."
  );
  let term;
  while (true) {
    term = false;
    term = await getInput("Termo: ");
    term = term.trim();

    if (term.length < 1) {
      console.log("Termo inválido");
      continue;
    }
    return term;
  }
}

async function getCategory() {
  console.clear();
  console.log("Buscar por:");
  console.log("1. Pessoas");
  console.log("2. Empresas");

  let category;
  while (true) {
    category = false;
    category = await getInput("Categoria: ");
    category = parseInt(category.trim());
    if (isNaN(category) || category < 1 || category > 2) {
      console.log("Categoria inválida");
      continue;
    }
    return category;
  }
}

export async function runFollow(browser) {
  const amount = await getAmount();
  const category = await getCategory();
  const term = await getTerm();

  await browser.actionFollowers(
    amount,
    term,
    category === 1 ? "people" : "companies"
  );
}
