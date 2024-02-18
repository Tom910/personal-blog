import { getCollection } from "astro:content";

/**
 * given default generated slug from astro:content
 * and return the full path of the blog post path.
 *
 * @param slug
 * @returns
 */
export const getPostPath = (slug: string) => `/blog/${slug}/`;

export const getTranslatePath = (slug: string) => `/translate/${slug}/`;

/**
 * get n latest blog post or all blog posts sorted
 * by date descending
 *
 * @param count
 * @returns
 */
export const getLatestPosts = async (count?: number) => {
  const blogs = await getCollection("blog");

  blogs.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  if (!count) return blogs;

  return blogs.slice(0, count);
};

export const getLatestTranslatePosts = async (count?: number) => {
  const blogs = await getCollection("translate");

  blogs.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  if (!count) return blogs;

  return blogs.slice(0, count);
};

/**
 * get total posts
 *
 * @returns
 */
export const getTotalPosts = async (): Promise<number> => {
  const blogs = await getCollection("blog");

  return blogs.length;
};

/**
 * get all unique tags from all blog posts
 *
 * @returns string[]
 */
export const getAllTags = async () => {
  const tags = new Set<string>();

  const blogs = await getLatestPosts();

  blogs.forEach(blog => blog.data.tags.forEach(tag => tags.add(tag)));

  return [...tags].sort();
};

/**
 * get all posts that have a given tag, sorted by the date
 * descending
 *
 * @param tag
 * @param count
 * @returns
 */
export const getPostsByTag = async (tag: string, count?: number) => {
  const blogs = await getLatestPosts();

  const filtered = blogs.filter(blog => blog.data.tags.includes(tag));

  if (!filtered) return blogs;

  return filtered.slice(0, count);
};
