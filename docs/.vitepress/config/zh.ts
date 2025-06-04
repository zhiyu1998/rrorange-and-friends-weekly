import { DefaultTheme, defineConfig } from 'vitepress'

import { createSideBarZH } from "../utils/createSideBar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "大橘和朋友们的周刊",
    description: "《大橘和朋友们的周刊》： 分享日常冲浪互联网看到好玩的网站、app应用、资源分享、效率软件工具集等",
    lang: "zh-Hans", //语言

    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        docFooter: {
            prev: '下一期',
            next: '上一期'
        },
        outlineTitle: "大纲",
        lastUpdatedText: "最近更新时间",

        sidebar: createSideBarZH(),

        socialLinks: [
            {
                icon: {
                    svg: '<svg t="1717909887402" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4533" width="200" height="200"><path d="M834.24 127.872a95.168 95.168 0 0 0-29.856 7.136h-0.128c-9.12 3.616-52.48 21.856-118.4 49.504l-236.224 99.488c-169.504 71.36-336.128 141.632-336.128 141.632l1.984-0.768s-11.488 3.776-23.488 12a64.96 64.96 0 0 0-18.752 18.144c-5.888 8.64-10.624 21.856-8.864 35.52 2.88 23.104 17.856 36.96 28.608 44.608 10.88 7.744 21.248 11.36 21.248 11.36h0.256l156.256 52.64c7.008 22.496 47.616 156 57.376 186.752 5.76 18.368 11.36 29.856 18.368 38.624 3.392 4.48 7.36 8.224 12.128 11.232a35.808 35.808 0 0 0 7.872 3.392l-1.6-0.384c0.48 0.128 0.864 0.512 1.216 0.64 1.28 0.352 2.144 0.48 3.776 0.736 24.736 7.488 44.608-7.872 44.608-7.872l1.12-0.896 92.256-84 154.624 118.624 3.52 1.504c32.224 14.144 64.864 6.272 82.112-7.616 17.376-13.984 24.128-31.872 24.128-31.872l1.12-2.88 119.488-612.128c3.392-15.104 4.256-29.248 0.512-42.976a57.824 57.824 0 0 0-24.992-33.504 59.904 59.904 0 0 0-34.144-8.64z m-3.232 65.6c-0.128 2.016 0.256 1.792-0.64 5.664v0.352l-118.368 605.76c-0.512 0.864-1.376 2.752-3.744 4.64-2.496 1.984-4.48 3.232-14.88-0.896l-189.12-144.992-114.24 104.128 24-153.28 308.992-288c12.736-11.84 8.48-14.336 8.48-14.336 0.896-14.528-19.232-4.256-19.232-4.256l-389.632 241.376-0.128-0.64-186.752-62.88v-0.128l-0.48-0.096a8.64 8.64 0 0 0 0.96-0.384l1.024-0.512 0.992-0.352s166.752-70.272 336.256-141.632c84.864-35.744 170.368-71.744 236.128-99.52 65.76-27.616 114.368-47.872 117.12-48.96 2.624-1.024 1.376-1.024 3.264-1.024z" p-id="4534"></path></svg>',
                },
                link: 'https://t.me/RrOrangeAndFriends/280'
            },
            { icon: 'github', link: 'https://github.com/zhiyu1998/rrorange-and-friends-weekly' },
            {
                icon: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>RSS</title><path d="M108.56,342.78a60.34,60.34,0,1,0,60.56,60.44A60.63,60.63,0,0,0,108.56,342.78Z"/><path d="M48,186.67v86.55c52,0,101.94,15.39,138.67,52.11s52,86.56,52,138.67h86.66C325.33,312.44,199.67,186.67,48,186.67Z"/><path d="M48,48v86.56c185.25,0,329.22,144.08,329.22,329.44H464C464,234.66,277.67,48,48,48Z"/></svg>',
                },
                link: "/feed.xml",
            },
        ],

        editLink: {
            pattern: "https://github.com/zhiyu1998/rrorange-and-friends-weekly/edit/master/docs/:path",
            text: "在GitHub上编辑此页",
        },
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "目录",
        darkModeSwitchLabel: "深色模式",
    },
})

export const search: DefaultTheme.AlgoliaSearchOptions = {
    appId: 'HZWQOO2CYB',
    apiKey: '46d7826fe9bee8db34a21ea83a247110',
    indexName: 'rrorangeandfriends',
    placeholder: '搜索文档',
    translations: {
        button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
        },
        modal: {
            searchBox: {
                resetButtonTitle: '清除查询条件',
                resetButtonAriaLabel: '清除查询条件',
                cancelButtonText: '取消',
                cancelButtonAriaLabel: '取消'
            },
            startScreen: {
                recentSearchesTitle: '搜索历史',
                noRecentSearchesText: '没有搜索历史',
                saveRecentSearchButtonTitle: '保存至搜索历史',
                removeRecentSearchButtonTitle: '从搜索历史中移除',
                favoriteSearchesTitle: '收藏',
                removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
                titleText: '无法获取结果',
                helpText: '你可能需要检查你的网络连接'
            },
            footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
                searchByText: '搜索提供者'
            },
            noResultsScreen: {
                noResultsText: '无法找到相关结果',
                suggestedQueryText: '你可以尝试查询',
                reportMissingResultsText: '你认为该查询应该有结果？',
                reportMissingResultsLinkText: '点击反馈'
            }
        }
    }
}
