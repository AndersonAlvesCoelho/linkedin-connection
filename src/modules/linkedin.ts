import { Page } from 'puppeteer';

export class LinkedinModule {
	constructor(private browser: LinkedinModule, private page: Page) {
		this.browser = browser;
		this.page = page;
	}

	async close() {
		await this.browser.close();
	}

	async returnToFeed() {
		if (this.page) {
			await this.page.goto('https://www.linkedin.com/feed/');
		}
	}
}
