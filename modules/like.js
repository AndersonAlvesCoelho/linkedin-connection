import getInput from "../helper/input.js";

async function getAmount() {
  console.clear();
  console.log(
    "Quantidade de Posts que deseja curtir. Maximo: 250" + "\nValor padrão: 20"
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

async function getHashtag() {
  console.clear();
  console.log(
    "Informe a hashtag que deseja buscar.\n" +
      "Exemplo: python, javascript, node, etc."
  );
  let hashtag;
  hashtag = await getInput("Hashtag: ");
  hashtag.trim();

  if (hashtag.length < 1) {
    return "";
  }
  return hashtag;
}

export async function runLike(browser) {
  const amount = await getAmount();
  const hashtag = await getHashtag();

  await browser.likingPosts(amount, hashtag);
}
