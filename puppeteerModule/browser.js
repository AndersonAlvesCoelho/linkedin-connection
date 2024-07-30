import fs from "fs";
import { browserConstants } from "../config/constants.js";
import { delay } from "../helper/delay.js";
import { login } from "./start.js";
const { buttonsPost, nextPage, buttonShowMorePosts, followers } =
  browserConstants;
const COOKIES_FILE = "../cookies.json";

/**
 * @class Browser
 * @description
 * Classe responsável por gerenciar as ações de navegação automatizadas no LinkedIn, como iniciar sessão, curtir posts, seguir pessoas e conectar-se com usuários.
 */
export class Browser {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  /**
   * @param {string} username - Nome de usuário do LinkedIn
   * @param {string} password - Senha do LinkedIn
   * @returns {Promise<void>}
   * @description
   * Inicializa a sessão do navegador com as credenciais fornecidas.
   */
  async initializeSession(username, password) {
    const { browser, page } = await login(username, password);
    this.browser = browser;
    this.page = page;
    // verificar se está nessa rota:  checkpoint/challenge/verify caso esteja, redirecionar para a /feed
    await this.loadCookies(page);
    await this.saveCookies(page);
  }

  /**
   * @param {Page} page - Instância da página do Puppeteer
   * @returns {Promise<void>}
   * @description
   * Salva os cookies da sessão atual em um arquivo.
   */
  async saveCookies(page) {
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
  }

  /**
   * @param {Page} page - Instância da página do Puppeteer
   * @returns {Promise<void>}
   * @description
   * Carrega os cookies do arquivo e os aplica na sessão atual.
   */
  async loadCookies(page) {
    if (fs.existsSync(COOKIES_FILE)) {
      const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, "utf-8"));
      await page.setCookie(...cookies);
    }
  }

  /**
   * @returns {Promise<void>}
   * @description
   * Fecha a sessão do navegador.
   */
  async close() {
    await this.browser.close();
  }

  /**
   * @param {string} category - Categoria da busca (pessoas, empresas)
   * @param {string} search - Termo de busca (ex: tech recruiter)
   * @param {boolean} hiring - Filtrar por vagas ativas (true ou false)
   * @param {string} hashtag - Hashtag para busca
   * @returns {string} URL construída com base nos parâmetros fornecidos
   * @description
   * Constrói uma URL de busca no LinkedIn com base nos parâmetros fornecidos.
   */
  buildUrl(
    category = "people", // people, companies
    search = "", // tech recruiter
    hiring = true, // true or false
    hashtag = "" // #techrecruiter
  ) {
    if (search)
      return `https://www.linkedin.com/search/results/${
        category + "/"
      }?keywords=${search}&activelyHiring="${hiring}"&geoUrn=%5B"106057199"%5D`;

    return `https://www.linkedin.com/feed/hashtag/${hashtag}/`;
  }

  /**
   * @param {number} amount - Quantidade de posts a serem curtidos
   * @param {string} hashtag - Hashtag para busca de posts
   * @returns {Promise<void>}
   * @description
   * Realiza login no LinkedIn e curte uma quantidade especificada de posts que correspondem a uma hashtag.
   */
  async likingPosts(amount = 20, hashtag = "") {
    try {
      if (hashtag) {
        await this.page.goto(this.buildUrl("all", "", false, hashtag));
        await delay(5000);
      }

      let count = 0;
      while (true) {
        await this.page.waitForSelector(buttonsPost);
        const buttons = await this.page.$$(buttonsPost);

        for (const button of buttons) {
          if (count >= amount) {
            await this.returnToFeed();
            return;
          }
          await button.click();
          await delay(1000);
          count++;
        }

        await this.page.waitForSelector(buttonShowMorePosts);
        await this.page.click(buttonShowMorePosts);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  /**
   * @param {number} amount - Quantidade de seguidores a serem adicionados
   * @param {string} term - Termo de busca (ex: tech recruiter)
   * @param {string} category - Categoria da busca (pessoas)
   * @returns {Promise<void>}
   * @description
   * Realiza login no LinkedIn e segue uma quantidade especificada de pessoas que correspondem a uma categoria.
   */
  async actionFollowers(amount = 20, term = "recruiter", category = "people") {
    try {
      const url = this.buildUrl(category, term);
      await this.page.goto(url);
      await delay(5000);

      let count = 0;
      while (true) {
        const buttons = await this.page
          .waitForSelector(followers)
          .then(async () => {
            return await this.page.$$(followers);
          })
          .catch(() => {
            return [];
          });

        console.log(buttons.length);
        for (const button of buttons) {
          if (count >= amount) {
            await this.returnToFeed();
            return;
          }
          await button.click();
          await delay(1000);

          count++;
        }

        await this.page.waitForSelector(nextPage);
        await this.page.click(nextPage);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  /**
   * @param {number} amount - Quantidade de pessoas a serem conectadas
   * @param {string} term - Termo de busca (ex: tech recruiter)
   * @param {boolean|string} note - Nota personalizada para ser enviada com o convite
   * @returns {Promise<void>}
   * @description
   * Realiza login no LinkedIn, busca pessoas com base no termo fornecido e envia convites de conexão com uma nota personalizada opcional.
   */
  async connectWithPeoples(amount, term, note = false) {
    try {
      const { connectButton, actions, getName, btnNoSendNote } =
        browserConstants.connect;

      const url = this.buildUrl("people", term, true, "");
      await this.page.goto(url);
      await delay(5000);

      let count = 0;
      while (true) {
        await delay(3000);
        const buttonsOfPeoples = await this.page
          .waitForSelector(connectButton)
          .then(async () => {
            return await this.page.$$(connectButton);
          })
          .catch(() => {
            return [];
          });

        const { btnAddNote, inputNote, btnSendNote } = actions;
        for (const people of buttonsOfPeoples) {
          if (count >= amount) {
            await this.returnToFeed();
            return;
          }

          await delay(1000);
          await people.click();
          await delay(1000);

          if (note) {
            const elemento = await people
              .getProperty("ariaLabel")
              .then((el) => el.jsonValue());
            const name = getName(elemento);

            await this.page.waitForSelector(btnAddNote);
            await this.page.click(btnAddNote);
            await delay(1000);

            const msg = note.replace("{{name}}", name);

            await this.page.waitForSelector(inputNote);
            await this.page.type(inputNote, msg);
            await delay(1000);

            await this.page.waitForSelector(btnSendNote);
            await this.page.click(btnSendNote);
            await delay(1000);
          } else {
            await delay(1000);
            await this.page.waitForSelector(btnNoSendNote);
            await this.page.click(btnNoSendNote);
            await delay(1000);
          }
        }

        // Ir para a próxima página quando não houver mais pessoas para conectar
        await this.page.waitForSelector(nextPage);
        await this.page.click(nextPage);
        await delay(5000);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  }

  async returnToFeed() {
    await this.page.goto("https://www.linkedin.com/feed/");
  }
}
