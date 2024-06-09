import { type HeadConfig, type TransformContext } from "vitepress";

// 处理每个页面的元数据
export function handleHeadMeta(context: TransformContext) {
  const { description, title, relativePath, frontmatter } = context.pageData;
  //TODO
  const curDesc = description || context.description;
  const cover = frontmatter.cover || 'https://fav0.com/favicon-512x512.png'
  const cardType = frontmatter.cover ? 'summary_large_image' : 'summary'
  // 增加Twitter卡片
  const ogUrl: HeadConfig = ["meta", { property: "og:url", content: addBase(relativePath) }]
  const ogTitle: HeadConfig = ["meta", { property: "og:title", content: title }]
  const ogDescription: HeadConfig = ["meta", { property: "og:description", content: curDesc }]
  const ogImage: HeadConfig = ["meta", { property: "og:image", content: cover }]
  const twitterCard: HeadConfig = ["meta", { name: "twitter:card", content: cardType }]
  const twitterImage: HeadConfig = ["meta", { name: "twitter:image:src", content: cover }]
  const twitterDescription: HeadConfig = ["meta", { name: "twitter:description", content: curDesc }]

  const twitterHead: HeadConfig[] = [
    ogUrl, ogTitle, ogDescription, ogImage,
    twitterCard, twitterDescription, twitterImage,
  ]

  // 预加载字体
  const preloadHead: HeadConfig[] = handleFontsPreload(context)

  return [ ...twitterHead, ...preloadHead ]
}

// TODO
export function addBase(relativePath: string) {
  const host = 'https://fav0.com'
  if (relativePath.startsWith('/')) {
    return host + relativePath
  } else {
    return host + '/' + relativePath
  }
}

export function handleFontsPreload({ assets }: TransformContext) {
  // 只预加载正文字体，代码字体不预加载，因为可能不会使用或者很少使用
  const SourceHanSerifCN = assets.find(file => /SourceHanSerifCN-VF\.\w+\.woff2/)
  
  if (SourceHanSerifCN) {
    return [
      [
        'link',
        {
          rel: 'preload',
          href: SourceHanSerifCN,
          as: 'font',
          type: 'font/woff2',
          crossorigin: ''
        }
      ]
    ] as HeadConfig[]
  }

  return []
}
