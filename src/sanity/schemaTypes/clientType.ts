// schemas/client.ts
import { defineType, defineField } from 'sanity';
import { Category } from './categoryType';


// TypeScript interface that matches your component
export interface Client {
  _id: string;
  _type: 'client';
  name: string;
  slug: {
    current: string;
  };
  logo: {
    asset: {
      _ref: string;
      url: string;
    };
    alt?: string;
  };
  description: string;
  category: Category; // Reference to category document

  website?: string;
  testimonial?: string;
}

export const clientType =  defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      options: {
        hotspot: true, // Allows for responsive cropping
        accept: 'image/svg+xml, image/png, image/jpeg', // Acceptable formats
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4, // Height of text area in CMS
      validation: (Rule) => Rule.required().min(50).max(500),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        disableNew: true, // Prevent creating new categories from here
        filter: 'defined(slug.current)', // Only show categories with slugs
      },
      validation: (Rule) => Rule.required(),
    }),
    // Optional fields
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: "Link to client's website",
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'text',
      rows: 3,
      description: 'Short quote from the client',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Client',
      type: 'boolean',
      initialValue: false,
      description: 'Show this client more prominently',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title',
      media: 'logo',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: `Category: ${subtitle}`,
        media,
      };
    },
  },
});