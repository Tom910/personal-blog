import { defineCollection } from "astro:content";
import { blogSchema, projectSchema } from "./_schemas";

const blog = defineCollection({
  type: "content",
  schema: blogSchema,
});

const project = defineCollection({
  type: "data",
  schema: projectSchema,
});

const translate = defineCollection({
  type: "content",
  schema: blogSchema,
});

export const collections = {
  blog: blog,
  project: project,
  translate: translate,
};
