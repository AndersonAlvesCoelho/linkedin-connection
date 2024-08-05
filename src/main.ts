import puppeteer from 'puppeteer';
import puppeteerConfig from './config/puppeteer.config';
import ConnectModule from './modules/connect';
import FollowerModule from './modules/follow';
import LikeModule from './modules/like';
import { LoginModule } from './modules/login';
import { getInputNumber } from './utils/input';

async function menuOptions(): Promise<number> {
	console.clear();
	console.log(' --- ** --- ***** --- ** --- ');
	console.log(' --- **     MENU     ** --- ');
	console.log(' --- ** --- ***** --- ** --- ');
	console.log('\n');
	console.log('1. Conectar com pessoas');
	console.log('2. Seguir pessoas');
	console.log('3. Curtir posts');
	console.log('4. Sair');
	console.log('\n');

	const option = await getInputNumber('Escolha uma opção: ');

	return option;
}

(async () => {
	const browser = await puppeteer.launch(puppeteerConfig);
	const page = await browser.newPage();

	const connectModule = new ConnectModule(browser, page);
	const followerModule = new FollowerModule(browser, page);
	const likeModule = new LikeModule(page, browser);
	// const linkedinModule = new LinkedinModule(browser, page);
	const loginModule = new LoginModule(browser, page);

	while (true) {
		const option = await menuOptions();
		await loginModule.run();

		switch (option) {
			case 1:
				await connectModule.run();
				break;
			case 2:
				await followerModule.run();
				break;
			case 3:
				await likeModule.run();
				break;
			case 4:
				await browser.close();
				return;
			default:
				console.log('Opção inválida');
				break;
		}
	}
})();
