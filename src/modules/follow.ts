import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { buildUrl } from '../utils/build-urls';
import { delayRandom } from '../utils/delay';
import { getInputNumber, getInputText } from '../utils/input';

const { followers: FOLLOWERS, pages: PAGES } = browserConstants;

class FollowerModule {
	private browser: Browser;
	private page: Page;
	constructor(browser) {
		this.browser = browser;
	}

	async getAmount() {
		console.clear();
		console.log('Quantidade de pessoas que deseja seguir. Máximo: 250\nValor padrão: 20');
		while (true) {
			const amount = await getInputNumber('Quantidade: ');
			if (isNaN(amount) || amount < 1 || amount > 250) {
				console.log('Quantidade inválida');
				continue;
			}
			return amount;
		}
	}

	async getTerm() {
		console.clear();
		console.log('Informe o termo de busca. Exemplo: Desenvolvedor, Recrutador, etc.');

		while (true) {
			const term = await getInputText('Termo: ');
			if (term.length < 1) {
				console.log('Termo inválido.');
				continue;
			}
			return term;
		}
	}

	async getCategory() {
		console.clear();
		console.log('Buscar por: Opção padrão: 1');
		console.log('1. Pessoas');
		console.log('2. Empresas');

		const categoris = ['people', 'company'];
		while (true) {
			const category = await getInputNumber('Categoria: ', 1);
			if ([1, 2].includes(category)) {
				return categoris[category - 1];
			}
			console.log('Categoria inválida');
		}
	}

	async actionFollowers(amount = 20, term = 'recruiter', category = 'people') {
		try {
			const url = buildUrl(category, term);
			await this.page.goto(url);
			await delayRandom(3000, 400);

			let count = 0;
			await this.page.waitForSelector(FOLLOWERS.btnFollow);
			const buttons = await this.page.$$(FOLLOWERS.btnFollow);
			for (const button of buttons) {
				if (count >= amount) {
					return;
				}
				await button.click();
				await delayRandom(300, 800);
				count++;
			}
		} catch (err) {
			console.error('Err: ', err);
		}
	}

	async run() {
		const amount = await this.getAmount();
		const category = await this.getCategory();
		const term = await this.getTerm();

		try {
			await this.actionFollowers(amount, term, category);
		} catch (err) {
			await this.page.goto(PAGES.feed);
		}
	}
}

export default FollowerModule;
