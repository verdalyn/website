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

export default async function Page({ params: { slug = 'index' } }) {
  let page: PageType | null

  page = await queryPageBySlug({
    slug,
  })

  console.log(page)

  if (!page) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          {page.featuredImage && (
            <div className="w-10 h-10">
            <Image src={page.featuredImage.url} alt={page.featuredImage.alt} width={600} height={400}/>
          </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <span className="mr-2">By {typeof page.author === 'string' ? page.author : page.author.email}</span>
              <span>•</span>
              <span className="ml-2">{new Date(page.publishedDate).toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{__html: page.layout?.[0]?.content_html as TrustedHTML }} >
              
            </div>

            <div className="flex flex-wrap gap-2">
              {page.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                  {tag.tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {page.categories.map((category, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}