import chromium from 'chrome-aws-lambda';

import { MenuApi } from '../types/menu';

const getExecutablePath = async () => {
	return process.env.CUSTOM_CHROMIUM || (await chromium.executablePath);
};

export const scrape = async (url: string, numArticles: number = 5) => {
	const browser = await chromium.puppeteer.launch({
		args: chromium.args,
		executablePath: await getExecutablePath(),
		headless: true,
	});

	const page = await browser.newPage();
	await page.goto(url, { waitUntil: 'networkidle2' });

	const loadArticles = (numArticles: number) => {
		const loader: () => Promise<Array<{ created_time: string, message: string }>> = async () => {
			const articles: Array<MenuApi> = await page.evaluate(() => {
				window.scrollBy(0, window.innerHeight);
				return Array.from(document.querySelectorAll('article')).map((article) => {
					const more = article.querySelector<HTMLElement>('[data-sigil="more"]');
					more && more.click();

					const time = article.dataset.ft!.match(/publish_time.+?(\d+)/)![1];
					const imageUrl = article.querySelector<HTMLElement>('.story_body_container > div:not(:first-of-type)')
						?.innerHTML.match(/url\(['"](.+?)['"]/)
					;

					return {
						created_time: new Date(parseInt(time) * 1000).toISOString(),
						message: article.querySelector<HTMLElement>('.story_body_container > div')?.innerText!,
						image: imageUrl && decodeURIComponent(imageUrl[1].replace(/(\\\w+ )/g, (code) => code.replace('\\', '%').trim())) || undefined,
						link: article.querySelector<HTMLAnchorElement>('[data-sigil="m-feed-voice-subtitle"] a')?.href!,
					};
				});
			});
			return articles.length > numArticles && articles.slice(0, numArticles) || loader();
		}

		return loader();
	}

	const articles = await loadArticles(numArticles);
	await browser.close();
	return articles;
};
