import { JmComicPage } from "@/api/page"
import type { uni } from "delta-comic-core"

export const parseBlog = (blog: Document) => {
  const paragraphs = Array.from(blog.querySelectorAll<HTMLParagraphElement>('div>p'))
  const result = new Array<Paragraph>()
  let index = -1
  for (const paragraph of paragraphs) {
    index++
    const img = paragraph.querySelector<HTMLImageElement>('span img')
    if (img) {
      result.push({
        type: 'img',
        src: img.src,
        aspect: {
          height: Number(img.style.height.match(/\d+/)?.[0]),
          width: Number(img.style.width.match(/\d+/)?.[0])
        }
      })
      continue
    }
    const link = paragraph.querySelector<HTMLAnchorElement>('span a')
    if (link) {
      const url = new URL(link.href)
      const id = url.pathname.match(/\d+/g)?.[0] ?? '350234'
      result.push({
        type: 'textSet',
        text: [{
          style: link.innerHTML.includes('<strong>') ? 'bold' : 'common',
          text: link.innerText,
          link: {
            content: JmComicPage.contentType,
            ep: id,
            id
          }
        }]
      })
      continue
    }
    const text = Array.from(paragraph.querySelectorAll<HTMLSpanElement>('span'))
    if (text.length > 0) {
      result.push({
        type: 'textSet',
        text: text.map(el => {
          const text = el.innerText
          return {
            style: el.innerHTML.includes('<strong>') ? 'bold' : 'common',
            text
          }
        })
      })
      continue
    }
    const last = result[index - 1]
    if (last && last.type == 'empty') {
      console.log('last', last)
      continue
    }
    result.push({
      type: 'empty'
    })
  }
  return result
}

export type Paragraph = {
  type: 'img'
  src: string
  aspect: {
    width: number
    height: number
  }
} | {
  type: 'textSet'
  text: TextAtom[]
} | {
  type: 'empty'
}
export type TextAtom = {
  style: 'bold' | 'common'
  text: string
  link?: {
    content: uni.content.ContentType_
    id: string
    ep: string
  }
}