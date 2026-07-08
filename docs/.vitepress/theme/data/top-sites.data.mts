import { createContentLoader } from "vitepress";

export type CuratedLinkEntry = {
  key: string;
  href: string;
  title: string;
  pagePath: string;
  issueTitle: string;
  date: string;
};

const HEADING_LINK_RE = /^### \[([^\]]+)\]\((https?:[^)\s]+)\)/gm;

function stableKey(pagePath: string, absoluteHref: string) {
  return `${pagePath}|${absoluteHref}`;
}

function normalizePagePath(url: string) {
  return url.replace(/\/index$/, "").replace(/\.html$/, "");
}

export default createContentLoader("posts/**/*.md", {
  includeSrc: true,
  transform(rawData) {
    const entries: CuratedLinkEntry[] = [];

    const pages = rawData
      .slice()
      .sort(
        (a, b) =>
          +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      );

    for (const page of pages) {
      const src = String(page.src || "").replace(/\r\n?/g, "\n");
      const pagePath = normalizePagePath(page.url);
      const issueTitle = String(page.frontmatter.title || "").trim();
      const date = String(page.frontmatter.date || "").trim();

      if (!src || !pagePath || !issueTitle || !date) continue;

      for (const match of src.matchAll(HEADING_LINK_RE)) {
        const title = match[1]?.trim();
        const href = match[2]?.trim();
        if (!title || !href) continue;

        entries.push({
          key: stableKey(pagePath, href),
          href,
          title,
          pagePath,
          issueTitle,
          date,
        });
      }
    }

    return entries;
  },
});
