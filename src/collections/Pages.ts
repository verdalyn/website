import type { CollectionConfig } from 'payload'
import {
    HTMLConverterFeature,
    lexicalEditor,
    lexicalHTML
  } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
    slug: 'pages',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'layout',
            type: 'blocks',
            blocks: [
                {
                    slug: 'content',
                    fields: [
                        {
                            name: 'content',
                            type: 'richText',
                            required: true,
                            editor: lexicalEditor({
                                features: ({ defaultFeatures }) => [
                                  ...defaultFeatures,
                                  // The HTMLConverter Feature is the feature which manages the HTML serializers.
                                  // If you do not pass any arguments to it, it will use the default serializers.
                                  HTMLConverterFeature({}),
                                ],
                              }),
                              
                        },
                        lexicalHTML('content', { name: 'content_html' }),
                    ],

                },
            ],
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'publishedDate',
            type: 'date',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            options: [
                {
                    label: 'Draft',
                    value: 'draft',
                },
                {
                    label: 'Published',
                    value: 'published',
                },
            ],
            defaultValue: 'draft',
            required: true,
        },
        {
            name: 'featuredImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'excerpt',
            type: 'textarea',
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
        },
        {
            name: 'tags',
            type: 'array',
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                },
            ],
        },
    ],
}
