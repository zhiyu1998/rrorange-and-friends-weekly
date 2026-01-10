import type { Router } from "vitepress";

type Opts = {
  router: Router;
  endpoint: string;
  contentSelector?: string;
  externalOnly?: boolean;
  maxKeys?: number;
};

function getPagePath() {
  return location.pathname + location.search;
}

function isPlainLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

function stableKey(pagePath: string, absoluteHref: string) {
  return `${pagePath}|${absoluteHref}`;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

function addOrUpdateBadge(a: HTMLAnchorElement, count: number) {
  let badge = a.nextElementSibling as HTMLElement | null;
  if (!badge || !badge.classList.contains("vp-link-count")) {
    badge = document.createElement("span");
    badge.className = "vp-link-count";
    badge.textContent = `${count}`;
    a.insertAdjacentElement("afterend", badge);
  } else {
    badge.textContent = `${count}`;
  }
}

function shouldTrack(a: HTMLAnchorElement, externalOnly: boolean) {
  const raw = a.getAttribute("href") || "";
  if (!raw) return false;
  if (/^(javascript:|mailto:|tel:)/i.test(raw)) return false;
  if (raw.startsWith("#")) return false;
  if (!a.textContent?.trim()) return false;

  try {
    const u = new URL(a.href);
    if (externalOnly) return u.hostname !== location.hostname;
    return true;
  } catch {
    return false;
  }
}

async function refreshBadges(endpoint: string, root: Element, externalOnly: boolean, maxKeys: number) {
  const pagePath = getPagePath();
  const anchors = Array.from(root.querySelectorAll("a")) as HTMLAnchorElement[];

  const keys: string[] = [];
  for (const a of anchors) {
    if (!shouldTrack(a, externalOnly)) continue;

    const key = stableKey(pagePath, a.href);
    a.dataset.lcKey = key;
    keys.push(key);
  }

  const uniq = Array.from(new Set(keys)).slice(0, maxKeys);
  if (!uniq.length) {
    console.log("[link-counter] No external links found to track");
    return;
  }

  console.log("[link-counter] Fetching counts for", uniq.length, "links");

  // Cloudflare Worker batch endpoint currently errors on >100 keys.
  // Chunk requests to keep rendering stable.
  const batchSize = 100;
  const counts: Record<string, number> = {};

  for (let offset = 0; offset < uniq.length; offset += batchSize) {
    const batchKeys = uniq.slice(offset, offset + batchSize);
    try {
      const data = await postJson<{ ok: boolean; counts: Record<string, number> }>(
        `${endpoint}/batch`,
        { keys: batchKeys }
      );

      if (!data.ok) continue;
      Object.assign(counts, data.counts);
    } catch (err) {
      console.error("[link-counter] Failed to fetch counts:", err);
    }
  }

  for (const a of anchors) {
    const k = a.dataset.lcKey;
    if (!k) continue;
    addOrUpdateBadge(a, counts[k] ?? 0);
  }
}

function bumpLocal(a: HTMLAnchorElement) {
  const badge = a.nextElementSibling as HTMLElement | null;
  const curr = badge?.classList.contains("vp-link-count")
    ? Number.parseInt(badge.textContent ?? "0", 10) || 0
    : 0;
  addOrUpdateBadge(a, curr + 1);
}

async function bumpRemote(endpoint: string, key: string) {
  try {
    // `sendBeacon` requests may omit the `Origin` header on some browsers, which
    // breaks the worker-side allowlist check and prevents writes to D1. Use a
    // simple keepalive POST instead.
    await fetch(`${endpoint}/click`, {
      method: "POST",
      body: JSON.stringify({ key }),
      keepalive: true,
    });
  } catch { /* ignore */ }
}

export function setupLinkCountBadges({
  router,
  endpoint,
  contentSelector = ".vp-doc",
  externalOnly = true,
  maxKeys = 500,
}: Opts) {
  const run = async () => {
    const root = document.querySelector(contentSelector);
    if (!root) {
      console.warn("[link-counter] Content selector not found:", contentSelector);
      return;
    }
    await refreshBadges(endpoint, root, externalOnly, maxKeys);
  };

  // 首次加载 - 等待 DOM 准备好
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(run, 100));
  } else {
    // DOM 已经加载，但 Vue 组件可能还在渲染，延迟执行
    setTimeout(run, 100);
  }

  // 路由切换后
  router.onAfterRouteChanged = () => {
    setTimeout(() => void run(), 100);
  };

  // 捕获点击（即时 +1）
  document.addEventListener(
    "click",
    (e) => {
      if (!(e instanceof MouseEvent)) return;
      if (!isPlainLeftClick(e)) return;

      const target = e.target as Element | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      const key = a.dataset.lcKey;
      if (!key) return;

      bumpLocal(a);
      void bumpRemote(endpoint, key);
    },
    true
  );
}
