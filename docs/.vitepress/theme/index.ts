// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import Theme from 'vitepress/theme-without-fonts' // https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts
import { inBrowser } from "vitepress";
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

import "./style.css";
import Comment from "./components/Comment.vue";
import ImageViewer from "./components/ImageViewer.vue"
import Subscribe from "./components/Subscribe.vue";
import { setupLinkCountBadges } from "./link-counter";

export default {
	...Theme,
	Layout: () => {
		return h(Theme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
			"doc-after": () => h(Comment),
			"doc-bottom": () => h(ImageViewer),
			"aside-top": () => h(Subscribe),
		});
	},

	enhanceApp({ app, router }) {
		app.component("Comment", Comment);

		if (inBrowser) {
			setupLinkCountBadges({
				router,
				endpoint: "https://vp-link-counter.kirillra3a2203.workers.dev",
				externalOnly: true,
				contentSelector: ".VPContent .content",
			});
		}
	},
};

