import path from "node:path";
import { writeFileSync } from "node:fs";
import { Feed } from "feed";
import { createContentLoader, type SiteConfig } from "vitepress";

const hostname = "https://rrorangeandfriends.de";

export async function createRssFileZH(config: SiteConfig) {
  const feed = new Feed({
    title: "大橘和朋友们的周刊",
    description: "《大橘和朋友们的周刊》：分享日常冲浪互联网看到好玩的网站、app应用、资源分享、效率软件工具集等。feedId:41680673211708416+userId:8Jv563DtwLFmrvznJtU90Or0LgSVjRhM",
    id: hostname,
    link: hostname,
    language: "zh-Hans",
    image: `${hostname}/favicon.png`,
    favicon: `${hostname}/favicon.ico`,
    copyright: `Copyright © 2024–${new Date().getFullYear()} RrOrange`,
  });

  const posts = await createContentLoader("posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort(
      (a, b) =>
          new Date(b.frontmatter.date).valueOf() -
          new Date(a.frontmatter.date).valueOf()
  );

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
      image: frontmatter.cover && `${hostname}${frontmatter.cover}`,
    });
  }

  writeFileSync(path.join(config.outDir, "feed.xml"), feed.rss2(), "utf-8");
}
