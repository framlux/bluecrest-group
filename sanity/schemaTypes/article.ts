import { defineType, defineField } from "sanity";
import { relatedServiceOptions } from "./service-options";

export default defineType({
  name: "article",
  title: "Insight Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Short summary of the article (shown in listings)",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      description: "Shown in Google results and link previews. Aim for 140–155 characters.",
      validation: (Rule) => [
        Rule.required().max(160),
        Rule.min(120).warning("Aim for 140–155 characters."),
      ],
    }),
    defineField({
      name: "relatedService",
      title: "Related service",
      type: "string",
      description: "The article links to this service page.",
      options: { list: relatedServiceOptions },
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Optional, 1200×630. Falls back to the main image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility",
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Financial Strategy", value: "financial-strategy" },
          { title: "Business Growth", value: "business-growth" },
          { title: "Tax Planning", value: "tax-planning" },
          { title: "CFO Insights", value: "cfo-insights" },
          { title: "Real Estate", value: "real-estate" },
          { title: "Startups", value: "startups" },
        ],
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      description: "Set when the article is meaningfully revised.",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Article",
      type: "boolean",
      description: "Show this article on the homepage",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      publishedAt: "publishedAt",
    },
    prepare(selection) {
      const { author, publishedAt } = selection;
      return {
        ...selection,
        subtitle: author
          ? `${author} — ${new Date(publishedAt).toLocaleDateString()}`
          : new Date(publishedAt).toLocaleDateString(),
      };
    },
  },
});
