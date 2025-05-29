// schemas/project.ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { FaVideo, FaImage, FaChartLine, FaMobile, FaBrush } from 'react-icons/fa'

// Fixed category slugs (match your existing categories)
// const FIXED_CATEGORIES = [
//   'marketing-strategy',
//   'video-editing',
//   'development',
//   'uxui',
//   'branding'
// ] as const

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    // ─── Core Information ────────────────────
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    }),
    
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    }),
    
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      validation: Rule => Rule.required()
    }),
    
    // ─── Fixed Categories ───────────────────
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Marketing Strategy', value: 'marketing-strategy' },
          { title: 'Video Editing', value: 'video-editing' },
          { title: 'Development', value: 'development' },
          { title: 'UX/UI', value: 'uxui' },
          { title: 'Branding', value: 'branding' }
        ]
      },
      validation: Rule => Rule.required().min(1)
    }),
    
    // ─── Project Format ─────────────────────
    defineField({
      name: 'format',
      title: 'Project Format',
      type: 'string',
      options: {
        list: [
          { title: 'Video Reel', value: 'video' },
          { title: 'Image Gallery', value: 'gallery' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Interactive', value: 'interactive' }
        ],
        layout: 'radio'
      },
      initialValue: 'video'
    }),
    
    // ─── Timeline ───────────────────────────
    defineField({
      name: 'timeline',
      title: 'Project Duration',
      type: 'object',
      fields: [
        defineField({
          name: 'start',
          title: 'Start Date',
          type: 'date'
        }),
        defineField({
          name: 'end',
          title: 'End Date',
          type: 'date'
        })
      ]
    }),
    
    // ─── Content Blocks ────────────────────
    defineField({
      name: 'content',
      title: 'Project Content',
      type: 'array',
      of: [
        // Video Block
        defineArrayMember({
          name: 'videoBlock',
          type: 'object',
          icon: FaVideo,
          fields: [
            defineField({
              name: 'url',
              title: 'Video URL',
              type: 'url'
            }),
            defineField({
              name: 'orientation',
              title: 'Orientation',
              type: 'string',
              options: {
                list: [
                  { title: 'Horizontal', value: 'horizontal' },
                  { title: 'Vertical', value: 'vertical' }
                ]
              }
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string'
            })
          ]
        }),
        
        // Image Gallery Block
        defineArrayMember({
          name: 'galleryBlock',
          type: 'object',
          icon: FaImage,
          fields: [
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{ type: 'image' }],
              options: { layout: 'grid' }
            }),
            defineField({
              name: 'layout',
              title: 'Layout Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Grid', value: 'grid' },
                  { title: 'Carousel', value: 'carousel' },
                  { title: 'Fullscreen', value: 'fullscreen' }
                ]
              }
            })
          ]
        }),
        
        // Metrics Block (For Marketing Strategy)
        defineArrayMember({
          name: 'metricsBlock',
          type: 'object',
          icon: FaChartLine,
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string'
            }),
            defineField({
              name: 'metrics',
              title: 'Key Metrics',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Metric Label',
                      type: 'string'
                    }),
                    defineField({
                      name: 'value',
                      title: 'Metric Value',
                      type: 'string'
                    })
                  ]
                }
              ]
            })
          ]
        }),
        
        // UI Showcase Block (For UX/UI)
        defineArrayMember({
          name: 'uiBlock',
          type: 'object',
          icon: FaMobile,
          fields: [
            defineField({
              name: 'screens',
              title: 'UI Screens',
              type: 'array',
              of: [{ type: 'image' }]
            }),
            defineField({
              name: 'prototype',
              title: 'Prototype URL',
              type: 'url'
            })
          ]
        }),
        
        // Brand Assets Block (For Branding)
        defineArrayMember({
          name: 'brandBlock',
          type: 'object',
          icon: FaBrush,
          fields: [
            defineField({
              name: 'assets',
              title: 'Brand Assets',
              type: 'array',
              of: [{ type: 'image' }]
            }),
            defineField({
              name: 'styleGuide',
              title: 'Style Guide URL',
              type: 'url'
            })
          ]
        })
      ]
    }),
    
    // ─── Project Summary ───────────────────
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(100)
    })
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client.name',
      categories: 'categories',
      media: 'content.0.galleryBlock.images.0'
    },
    prepare({ title, client, categories, media }) {
      return {
        title,
        subtitle: `${client} | ${categories.join(', ')}`,
        media
      }
    }
  }
})