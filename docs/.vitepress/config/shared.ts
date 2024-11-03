import { defineConfig, type SiteConfig } from 'vitepress'
// 自动导入TDesign
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

import { createRssFileZH } from "../utils/rss";
import { handleHeadMeta } from "../utils/handleHeadMeta";
import { search as zhSearch } from './zh'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://zhiyu1998.github.io/rrorange-and-friends-weekly'
  },
  head: [
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-Z6HGDC7ZBL" }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Z6HGDC7ZBL');`,
    ],

    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  ],
  // https://vitepress.dev/reference/site-config#transformhead
  async transformHead(context) {
    return handleHeadMeta(context)
  },
  buildEnd: (config: SiteConfig) => {
    createRssFileZH(config);
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/favicon.png', width: 24, height: 24 },
    outline: [2, 4],

    search: {
      provider: "algolia",
      options: {
        ...zhSearch
      }
    },

    externalLinkIcon: true,
  },

  vite: {
    plugins: [
      // ...
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
    ],
  },
})
