import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { buildURL } from '../utils/build-urls';
import { delay, delayRandom } from '../utils/delay';
import { getInputNumber, getInputText } from './../utils/input';

const { connect: CONNECT, pages: PAGES } = browserConstants;

class ConnectModule {
	constructor(private browser: Browser, private page: Page) {
		this.browser = browser;
		this.page = page;
	}

	async hasNote(): Promise<boolean> {
		console.clear();
		console.log('Deseja enviar mensagem para as conexões?');

		while (true) {
			const needSendNote = await getInputText('[S]/N: ', true, 's');
			if (['s', 'n'].includes(needSendNote)) {
				return needSendNote === 's';
			}
			console.clear();
			console.log('Opção inválida, tente novamente.');
		}
	}

	async getAmount(): Promise<number> {
		console.clear();
		console.log(
			'Quantas conexões deseja fazer?\nObs.: O máximo de conexões semanal permitida pelo linkedin é de 250 conexões\n',
		);

		while (true) {
			const amountConnections = await getInputNumber('Quantidade de conexões: ');
			if (amountConnections > 0 && amountConnections <= 250) {
				return amountConnections;
			}
			console.log('Quantidade inválida, tente novamente.');
		}
	}

	async getNote(): Promise<string> {
		console.clear();
		console.log(
			`\nEscreva a mensagem que deseja enviar: Obs.: Use no máximo 200 caracteres\n
      Adicione a chave {{name}} para adicionar o nome do usuário que será conectado\n`,
		);

		while (true) {
			const note = await getInputText('Mensagem: ');
			if (note.length > 0 && note.length <= 200) {
				return note;
			}
			console.log('Mensagem inválida, tente novamente.');
		}
	}

	async getTermOfSearch(): Promise<string> {
		console.clear();
		console.log('Informe o termo de busca. Exemplo: Desenvolvedor, Recrutador, etc.');

		while (true) {
			const term = await getInputText('Termo: ');
			if (term.length > 0) {
				return term;
			}
			console.log('Termo inválido, tente novamente.');
		}
	}

	async run(): Promise<void> {
		const amount = await this.getAmount();
		const term = await this.getTermOfSearch();
		const hasNote = await this.hasNote();
		const note = await this.hasNote();

		await this.startConnect(amount, term, note);
	}

	async startConnect(amount, term, note = false) {
		try {
			const url = buildURL('people', term, '');
			await this.page.goto(url);
			await delayRandom(2000, 5000);

			let count = 0;
			while (true) {
				await delayRandom(3000, 5000);
				await this.page.waitForSelector(CONNECT.connectButton);
				const buttonsOfPeoples = await this.page.$$(CONNECT.connectButton);

				for (const people of buttonsOfPeoples) {
					if (count >= amount) {
						await this.page.goto(PAGES.feed);
						return;
					}
					await delayRandom(1000, 2000);
					await people.click();

					if (note) {
						await delayRandom(1500, 2500);
						const elemento = await people.getProperty('ariaLabel').then(el => el.jsonValue());
						const name = CONNECT.getName(elemento);

						await this.page.waitForSelector(CONNECT.btnAddNote);
						await this.page.click(CONNECT.btnAddNote);
						await delayRandom(800, 1500);

						const msg = note.replace('{{name}}', name);

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
			console.error('Err: ', err);
		}
	}
}

export default ConnectModule;
