import { NowRequest, NowResponse } from '@now/node';

import { scrape } from './_lib/scrape';

export default async (_req: NowRequest, res: NowResponse) => {
	const { PAGE_URL, PAGE_ARTICLES } = process.env;
	const articles = await scrape(PAGE_URL!, parseInt(PAGE_ARTICLES!));

	// See: https://zeit.co/docs/v2/serverless-functions/edge-caching?query=cache#stale-while-revalidate
	res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');

	res.json(articles);
};
