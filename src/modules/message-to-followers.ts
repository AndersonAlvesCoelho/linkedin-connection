import { Browser, Page } from 'puppeteer';

export class MessageToFollowers {
	private browser: Browser;
	private page: Page;
	constructor(browser: Browser, page: Page) {
		this.browser = browser;
		this.page = page;
	}
}
