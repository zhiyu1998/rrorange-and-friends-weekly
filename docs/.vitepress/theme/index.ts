// https://vitepress.dev/guide/custom-theme
import { h, defineComponent } from "vue";
import Theme from 'vitepress/theme-without-fonts' // https://vitepress.dev/zh/guide/extending-default-theme#using-different-fonts
import { inBrowser } from "vitepress";
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

import "./style.css";
import Comment from "./components/Comment.vue";
import ImageViewer from "./components/ImageViewer.vue"
import Subscribe from "./components/Subscribe.vue";
import { setupLinkCountBadges } from "./link-counter";
import { useOutlineAutoScroll } from "./composables/useOutlineAutoScroll";

/**
 * 隐形启动组件：让右侧大纲随文章滚动，激活项自动滚进大纲视口。
 * 不渲染任何 DOM，仅在大纲存在时挂载监听逻辑。
 */
const OutlineAutoScroll = defineComponent({
	name: "OutlineAutoScroll",
	setup() {
		useOutlineAutoScroll();
		return () => null;
	},
});

export default {
	...Theme,
	Layout: () => {
		return h(Theme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
			"doc-after": () => h(Comment),
			"doc-bottom": () => h(ImageViewer),
			"aside-top": () => h(Subscribe),
			"doc-before": () => h(OutlineAutoScroll),
		});
	},

	enhanceApp({ app, router }) {
		app.component("Comment", Comment);

		if (inBrowser) {
			setupLinkCountBadges({
				router,
				endpoint: "https://vp-link-counter.rrorangeandfriends.de",
				externalOnly: true,
				contentSelector: ".vp-doc",
				dedupWindowSec: 86400,
			});
		}
	},
};

