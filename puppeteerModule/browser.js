


export default async function likingPosts(page) {
  try {
    while (true) {
      // Espera até que os botões estejam disponíveis na página
      await page.waitForSelector('button.artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.ember-view.social-actions-button.react-button__trigger[aria-pressed="false"]');
      
      // Obtém todos os botões disponíveis na página
      const buttons = await page.$$('button.artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.ember-view.social-actions-button.react-button__trigger[aria-pressed="false"]');
      
      // Clica em cada botão com um intervalo de 1 segundo entre cada clique
      for (let i = 0; i < buttons.length; i++) {
        await buttons[i].click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo antes de clicar no próximo botão
      }
    }
  } catch (err) {
    console.error("Err: ", err);
  }
}
