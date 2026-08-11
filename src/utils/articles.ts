import { getCollection } from 'astro:content';

export async function getPublishedArticles() {
  const articles = await getCollection('articles', ({ data }) => data.draft !== true);
  return articles.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function articlePath(id: string) {
  return `/insights/${id}/`;
}
