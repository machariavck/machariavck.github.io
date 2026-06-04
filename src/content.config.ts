import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";
import { parse as parseToml } from "toml";

/**
 * Loader and schema for the configuration collection.
 * It loads a TOML file from the `content/configuration.toml` path and defines the schema for the configuration data.
 */
const configuration = defineCollection({
  loader: file("content/configuration.toml", {
    parser: (text) => JSON.parse(JSON.stringify(parseToml(text))),
  }),
  schema: z.object({
    site: z.object({
      baseUrl: z.string().url(),
    }),

    globalMeta: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).optional(),
    }),

    notFoundMeta: z.object({
      title: z.string(),
      description: z.string()
    }),

    blogMeta: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).optional(),
    }),
    
    aboutMeta: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).optional(),
    }),

    personal: z.object({
      name: z.string(),
      xProfile: z.string().url().optional()
    }),

    texts: z.object({
      articlesName: z.string(),
      viewAll: z.string(),
      noArticles: z.string()
    }),

    menu: z.object({
      home: z.string(),
      blog: z.string(),
      about: z.string()
    }),
  }),
});

/**
 * Loader and schema for the blog collection.
 * It loads markdown files from the `content/blogs` directory and defines the schema for each blog post.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blogs" }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().optional(),
      description: z.string(),
      tags: z.array(z.string()).optional(),
      featured: z.boolean().default(false),
      timestamp: z.date().transform((val) => new Date(val)),
    })
    .transform((data) => {
      const slug =
        data.slug ??
        data.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
      const newData = {
        ...data,
        slug,
      };
      return newData;
    }),
});

export const collections = { blog, configuration };
