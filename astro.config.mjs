import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig, sharpImageService } from "astro/config";

export default defineConfig({
  compressHTML: true,
  image: {
    service: sharpImageService(),
  },
  site: "https://amarchenko.dev/",
  markdown: {
    gfm: true,
    shikiConfig: {
      theme: "github-light",
    },
  },
  integrations: [
    tailwind(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-light",
      },
    }),
    sitemap(),
    preact({
      compat: true,
    }),
  ],
});
