import menu from "./helper/menu.js";
import { runConnetion } from "./modules/connection.js";

import likingPosts from "./puppeteerModule/browser.js";

async function main() {
  const { option, username, password } = await menu();

  switch (parseInt(option)) {
    case 1:
      await likingPosts(username, password);
      break;
    case 2:
      await runConnetion(username, password);
      break;
    default:
      console.log("Não existe essa opção");
  }
}

main();
