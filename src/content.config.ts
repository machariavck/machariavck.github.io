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
    /**
     * Core site configuration.
     */
    site: z.object({
      baseUrl: z.string().url(),
    }),

    /**
     * The global metadata for the site. If specific page metadata is not provided,
     * this metadata will be used as a fallback for SEO and Open Graph tags.
     */
    globalMeta: z.object({
      /**
       * The title of the page, used in the HTML `<title>` tag and Open Graph metadata.
       */
      title: z.string(),

      /**
       * The short description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      description: z.string(),

      /**
       * Keywords for SEO, used in the `<meta name="keywords">` tag.
       */
      keywords: z.array(z.string()).optional(),
    }),

    notFoundMeta: z.object({
      title: z.string(),
      description: z.string()
    }),

    blogMeta: z.object({
      /**
       * The title of the page, used in the HTML `<title>` tag and Open Graph metadata.
       */
      title: z.string(),
      description: z.string(),

      /**
       * Keywords for SEO, used in the `<meta name="keywords">` tag.
       */
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
      blog: z.string()
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
      /**
       * The title of the blog post.
       */
      title: z.string(),

      /**
       * The slug for the blog post, used in the URL.
       */
      slug: z.string().optional(),

      /**
       * A short description of the blog post, used in Open Graph metadata and as a fallback for SEO.
       */
      description: z.string(),

      /**
       * The tags associated with the blog post, used for categorization and filtering.
       */
      tags: z.array(z.string()).optional(),

      /**
       * Whether the blog post is featured on the homepage.
       */
      featured: z.boolean().default(false),

      /**
       * The timestamp of the blog post, used for sorting and displaying the date.
       */
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
