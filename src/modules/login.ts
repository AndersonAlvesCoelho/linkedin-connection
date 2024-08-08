import { input, password } from '@inquirer/prompts';
import fs, { promises as fsPromises } from 'fs';
import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { delay, delayRandom } from '../utils/delay';

const { login: LOGIN } = browserConstants;

export class LoginModule {
	private browser: Browser;
	private page: Page;
	private username: string;
	private password: string;

	constructor(browser: Browser, page: Page) {
		this.browser = browser;
		this.page = page;
		this.username = 'a0a0coelho0@gmail.com';
		this.password = 'LinkedinCoelho98765';
	}

	async getCredentials() {
		do {
			this.username = await input({ message: 'E-mail ou Telefone:' });
			if (!this.username) {
				console.log('O campo de e-mail/telefone não pode estar vazio.');
			}
		} while (!this.username);

		do {
			this.password = await password({ message: 'Senha', mask: true });
			if (!this.password) {
				console.log('O campo de senha não pode estar vazio.');
			}
		} while (!this.password);
	}

	async setOnForm() {
		await delay(5000);

		await this.page.type(LOGIN.email, this.username);
		await this.page.type(LOGIN.password, this.password);

		await delay(1000);
		await this.page.click(LOGIN.submit);
	}

	async saveSession() {
		try {
			const [cookies, sessionStorage, localStorage] = await Promise.all([
				this.page.cookies(),
				this.page.evaluate(() => sessionStorage),
				this.page.evaluate(() => localStorage),
			]);

			await Promise.all([
				fsPromises.writeFile('cookies.json', JSON.stringify(cookies, null, 2), 'utf-8'),
				fsPromises.writeFile('sessionStorage.json', JSON.stringify(sessionStorage, null, 2), 'utf-8'),
				fsPromises.writeFile('localStorage.json', JSON.stringify(localStorage, null, 2), 'utf-8'),
			]);
		} catch (error) {
			console.error('Erro ao salvar a sessão:', error);
		}
	}

	async loadSession(): Promise<boolean> {
		// verificar se os arquivos existem
		if (
			!fs.existsSync('cookies.json') ||
			!fs.existsSync('sessionStorage.json') ||
			!fs.existsSync('localStorage.json')
		) {
			return false;
		}

		const [cookies, sessionStorage, localStorage] = await Promise.all([
			fsPromises.readFile('cookies.json', 'utf-8'),
			fsPromises.readFile('sessionStorage.json', 'utf-8'),
			fsPromises.readFile('localStorage.json', 'utf-8'),
		]);

		await this.page.setCookie(...JSON.parse(cookies));
		await this.page.evaluate(sessionStorage => {
			window.sessionStorage = JSON.parse(sessionStorage);
		}, sessionStorage);
		await this.page.evaluate(localStorage => {
			window.localStorage = JSON.parse(localStorage);
		}, localStorage);

		return true;
	}

	async isLoginError(): Promise<boolean> {
		const usernameError = await this.page
			.$eval(LOGIN.errorUsername, el => el.textContent?.trim() || null)
			.catch(() => null);
		const passwordError = await this.page
			.$eval(LOGIN.errorPassword, el => el.textContent?.trim() || null)
			.catch(() => null);

		if (usernameError && usernameError.includes('Insira um nome de usuário válido')) {
			console.log('O nome de usuário fornecido é inválido.');
			return true;
		}
		if (passwordError && passwordError.includes('A senha deve ter no mínimo 6 caracteres.')) {
			console.log('A senha fornecida deve ter pelo menos 6 caracteres.');
			return true;
		}
		if (
			[usernameError, passwordError]?.includes('E-mail ou senha incorreta. Tente novamente ou  crie uma conta .')
		) {
			console.log('E-mail ou senha incorreta.');
			return true;
		}

		return false;
	}

	async run() {
		await this.page.goto(LOGIN.url);
		await delay(1000);
		console.clear();

		// const hasSession = await this.loadSession();
		// console.log("hasSession ", hasSession)
		// if (hasSession) {
		// 	return;
		// }

		let loginSuccessful = false;
		while (!loginSuccessful) {
			// await this.getCredentials();
			await this.setOnForm();

			if (await this.isLoginError()) continue;

			loginSuccessful = true;
		}

		await delayRandom(2000, 5000);
		await this.saveSession();
	}
}
