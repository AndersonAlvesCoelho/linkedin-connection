import { promises as fs } from 'fs';

import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { delayRandom } from '../utils/delay';
import { getInputText } from '../utils/input';

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

	async menu() {
		console.clear();
		console.log(' --- ** --- ***** --- ** --- ');
		console.log(' --- **     LOGIN    ** --- ');
		console.log(' --- ** --- ***** --- ** --- ');
		console.log('\n');
	}

	async getCredentials() {
		this.username = await getInputText('Email: ', false, null, false);
		this.password = await getInputText('Senha: ', false, null, true);
	}

	async setOnForm() {
		await this.page.type(LOGIN.email, this.username, { delay: 100 });
		await this.page.type(LOGIN.password, this.password, { delay: 130 });
		await delayRandom(300, 1000);
		await this.page.click(LOGIN.submit);
	}

	async saveSession() {
		const [cookies, sessionStorage, localStorage] = await Promise.all([
			this.page.cookies(),
			this.page.evaluate(() => sessionStorage),
			this.page.evaluate(() => localStorage),
		]);

		await Promise.all([
			fs.writeFile('cookies.json', JSON.stringify(cookies, null, 2), 'utf-8'),
			fs.writeFile('sessionStorage.json', JSON.stringify(sessionStorage, null, 2), 'utf-8'),
			fs.writeFile('localStorage.json', JSON.stringify(localStorage, null, 2), 'utf-8'),
		]);
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
			fs.readFile('cookies.json', 'utf-8'),
			fs.readFile('sessionStorage.json', 'utf-8'),
			fs.readFile('localStorage.json', 'utf-8'),
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
