import { browserConstants } from '../config/constants';

const { pages: PAGES } = browserConstants;

export default function buildURL(category = 'people', search = '', hashtag = ''): string {
	if (search.length > 0) return PAGES.search.replace('{{category}}', category).replace('{{search}}', search);

	return PAGES.hashtag.replace('{{hashtag}}', hashtag);
}
