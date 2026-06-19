import { onBeforeUnmount, onMounted } from "vue";
import { onContentUpdated } from "vitepress";

/**
 * 让右侧大纲随文章滚动：当前章节对应的大纲项被 VitePress 标记为
 * `.active` 后，把它滚动到大纲容器可视区域的**垂直居中**位置。
 * 仅补一个滚动动作，不改动 VitePress 的激活逻辑。
 *
 * 关键点：只手动滚动大纲容器 `.aside-container`（position: fixed;
 * overflow-y: auto），绝不用 scrollIntoView —— 那样会同时滚动
 * window（所有可滚动祖先），点大纲/滚动文章时会把页面也拖动，
 * 体感很差。这里通过 element.scrollIntoView 的「平替」：
 * container.scrollTop = offset 计算来只动大纲容器。
 */
export function useOutlineAutoScroll() {
  let observer: MutationObserver | null = null;
  let lastActive: Element | null = null;
  let rafId = 0;

  const OUTLINE_LINK_SELECTOR = ".VPDocAsideOutline a";

  /** 把激活项滚动到大纲容器的垂直居中（只动容器，不碰 window） */
  function centerActive(container: HTMLElement, el: Element) {
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    // 激活项相对于容器当前滚动内容的偏移
    const elOffsetTop = elRect.top - cRect.top + container.scrollTop;
    const target =
      elOffsetTop - (container.clientHeight - elRect.height) / 2;
    container.scrollTo({
      top: Math.max(0, target),
      behavior: "smooth",
    });
  }

  function scrollToActive(el: Element) {
    // 同一激活项不重复触发；用 rAF 节流，避免和页面滚动抢帧
    if (el === lastActive) return;
    lastActive = el;
    const container = document.querySelector<HTMLElement>(".aside-container");
    if (!container) return;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => centerActive(container, el));
  }

  function bind() {
    disconnect();

    const container = document.querySelector<HTMLElement>(".aside-container");
    // 移动端无 aside，或当前页没有大纲，直接跳过
    if (!container) return;

    // 初次绑定时，若已有激活项，先把它居中
    const initialActive = container.querySelector<HTMLElement>(
      `${OUTLINE_LINK_SELECTOR}.active`
    );
    if (initialActive) {
      lastActive = initialActive;
      centerActive(container, initialActive);
    }

    // 监听大纲内 class 变化 —— VitePress 的 useActiveAnchor 会切换 .active
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type !== "attributes" || m.attributeName !== "class") continue;
        const target = m.target as Element;
        if (target.classList.contains("active")) {
          scrollToActive(target);
        }
      }
    });

    observer.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  function disconnect() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastActive = null;
  }

  onMounted(() => {
    bind();
  });

  // 路由/内容更新后重新绑定（大纲 DOM 会重建）
  onContentUpdated(() => {
    bind();
  });

  onBeforeUnmount(() => {
    disconnect();
  });
}
