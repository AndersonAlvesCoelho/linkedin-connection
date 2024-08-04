import getInput from "../helper/input.js";

class PostLiker {
  constructor(browser) {
    this.browser = browser;
  }

  async getAmount() {
    console.clear();
    console.log(
      "Quantidade de Posts que deseja curtir. Máximo: 250\nValor padrão: 20"
    );
    let amount;
    while (true) {
      amount = await getInput("Quantidade: ");
      amount = parseInt(amount.trim());
      if (amount < 1 || amount > 250) {
        console.log("Quantidade inválida");
        continue;
      }
      return amount;
    }
  }

  async getHashtag() {
    console.clear();
    console.log(
      "Informe a hashtag que deseja buscar.\n" +
        "Exemplo: python, javascript, node, etc."
    );
    let hashtag = await getInput("Hashtag: ");
    hashtag = hashtag.trim();

    if (hashtag.length < 1) {
      return "";
    }
    return hashtag;
  }

  async runLike() {
    const [amount, hashtag] = await Promise.all([
      this.getAmount(),
      this.getHashtag(),
    ]);

    await this.browser.likingPosts(amount, hashtag);
  }
}

export default PostLiker;
