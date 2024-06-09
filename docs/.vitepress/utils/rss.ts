import path from "node:path";
import { writeFileSync } from "node:fs";
import { Feed } from "feed";
import { createContentLoader, type SiteConfig } from "vitepress";

// TODO
const hostname = "https://fav0.com";

export async function createRssFileZH(config: SiteConfig) {
  const feed = new Feed({
    title: "大橘和朋友们的周刊",
    description: "《大橘和朋友们的周刊》：分享日常冲浪互联网看到好玩的网站、app应用、资源分享、效率软件工具集等",
    id: hostname,
    link: hostname,
    language: "zh-Hans",
    image: "/favicon.png",
    favicon: `/favicon.ico`,
    copyright: "Copyright© 2024-present RrOrange",
  });

  const posts = await createContentLoader("posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort((a, b) => Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)));

  for (const { url, excerpt, html, frontmatter } of posts) {
    // 仅保留最近5篇文章
    if (feed.items.length >= 5) {
      break;
    }

    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: "RrOrange",
          email: "renzhiyu0416@proton.me",
          link: "https://github.com/zhiyu1998",
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed.xml"), feed.rss2(), "utf-8");
}

export async function createRssFileEN(config: SiteConfig) {
  const feed = new Feed({
    title: "RrOrange and Friends Weekly",
    description: "RrOrange and Friends Weekly: Sharing daily surfing on the Internet, interesting websites, app applications, resource sharing, efficiency software toolsets, etc.",
    id: hostname,
    link: hostname,
    language: "en-US",
    image: "/favicon.png",
    favicon: `/favicon.ico`,
    copyright: "Copyright© 2024-present RrOrange",
  });

  const posts = await createContentLoader("en/posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort((a, b) => Number(+new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)));

  for (const { url, excerpt, html, frontmatter } of posts) {
    // 仅保留最近5篇文章
    if (feed.items.length >= 5) {
      break;
    }

    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: "RrOrange",
          email: "renzhiyu0416@proton.me",
          link: "https://github.com/zhiyu1998",
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed-en.xml"), feed.rss2(), "utf-8");
}
