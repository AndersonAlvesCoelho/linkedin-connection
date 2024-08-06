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
		this.username = '';
		this.password = '';
	}

	async getCredentials() {
		console.clear();
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
		await this.page.type(LOGIN.email, this.username, { delay: 100 });
		await this.page.type(LOGIN.password, this.password, { delay: 130 });
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

	async run() {
		const hasSession = await this.loadSession();
		if (hasSession) {
			return;
		}
		await this.getCredentials();
		await this.setOnForm();
		delayRandom(2000, 5000);
		await this.saveSession();
	}
}
