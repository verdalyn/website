import type { Metadata } from 'next'

import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React, { cache, ReactNode } from 'react'

import type { Page as PageType } from '../../../../payload-types'
import { lexicalToHTML } from '@/collections/helpers/lexicalToHTML'
// import { Blocks } from '@/utils/RenderBlocks'
// import { generateMeta } from '@/utils/generateMeta'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {

  const parsedSlug = decodeURIComponent(slug)

  const payload = await getPayloadHMR({ config })

  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      slug: {
        equals: parsedSlug,
      },
    },
  })

  return result.docs?.[0] || null
})


export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
  })

  return pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'index'
    })
    .map(({ slug }) => slug)
}

interface PageProps {
  params: Promise<{ slug?: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || 'index';

  let page: PageType | null;

  page = await queryPageBySlug({
    slug,
  });

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white shadow-sm rounded-lg overflow-hidden">
          {page.featuredImage && (
            <div className="relative w-full h-96">
              <Image 
                src={page.featuredImage.url} 
                alt={page.featuredImage.alt} 
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-500 ease-in-out hover:opacity-90"
              />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{page.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-2 font-medium">By {typeof page.author === 'string' ? page.author : page.author.email}</span>
              <span className="mx-2">•</span>
              <span className="ml-2">{format(new Date(page.publishedDate), 'MMMM d, yyyy')}</span>
            </div>
            
            {page.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {page.categories.map((category, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8 text-gray-900" dangerouslySetInnerHTML={{ __html: page.layout?.[0]?.content_html as TrustedHTML }} />

            {page.tags.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {page.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {tag.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
