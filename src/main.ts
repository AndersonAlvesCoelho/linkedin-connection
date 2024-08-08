import { select } from '@inquirer/prompts';
import puppeteer from 'puppeteer';
import puppeteerConfig from './config/puppeteer.config';
import LikeModule from './modules/like';
import { LoginModule } from './modules/login';

(async () => {

	const browser = await puppeteer.launch(puppeteerConfig);
	const page = await browser.newPage();

	// MODULE'S
	await new LoginModule(browser, page).run();

	// const connectModule = new ConnectModule(browser, page);
	// const followerModule = new FollowerModule(browser, page);
	// const linkedinModule = new LinkedinModule(browser, page);
	let exit = true;

	while (exit) {
		console.clear()
		const option = await select({
			message: 'Select a package manager',
			choices: [
				{
					name: '1. Conectar com pessoas',
					value: 1,
				},
				{
					name: '2. Seguir pessoas',
					value: 2,
				},
				{
					name: '3. Curtir posts',
					value: 3,
				},
				{
					name: '4. Sair',
					value: 4,
				},
			],
		});

		switch (option) {
			case 1:
				console.log('await connectModule.run()');
				break;
			case 2:
				console.log('await followerModule.run()');
				break;
			case 3:
				await new LikeModule(page, browser).run();
				break;
			case 4:
				console.log('await browser.close()');
				exit = false;
				return;
			default:
				console.log('Opção inválida');
				break;
		}
	}
})();
