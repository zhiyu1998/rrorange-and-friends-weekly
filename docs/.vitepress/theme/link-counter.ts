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
    badge.textContent = `(${count})`;
    badge.style.marginLeft = "6px";
    badge.style.fontSize = "12px";
    badge.style.opacity = "0.75";
    badge.style.userSelect = "none";
    a.insertAdjacentElement("afterend", badge);
  } else {
    badge.textContent = `(${count})`;
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
  if (!uniq.length) return;

  const data = await postJson<{ ok: boolean; counts: Record<string, number> }>(
    `${endpoint}/batch`,
    { keys: uniq }
  );

  if (!data.ok) return;

  for (const a of anchors) {
    const k = a.dataset.lcKey;
    if (!k) continue;
    addOrUpdateBadge(a, data.counts[k] ?? 0);
  }
}

function bumpLocal(a: HTMLAnchorElement) {
  const badge = a.nextElementSibling as HTMLElement | null;
  const m = badge?.classList.contains("vp-link-count")
    ? badge.textContent?.match(/\((\d+)\)/)
    : null;
  const curr = m ? parseInt(m[1], 10) : 0;
  addOrUpdateBadge(a, curr + 1);
}

async function bumpRemote(endpoint: string, key: string) {
  try {
    const payload = JSON.stringify({ key });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(`${endpoint}/click`, blob);
      return;
    }
  } catch { /* ignore */ }

  try {
    await postJson(`${endpoint}/click`, { key });
  } catch { /* ignore */ }
}

export function setupLinkCountBadges({
  router,
  endpoint,
  contentSelector = ".VPContent .content",
  externalOnly = true,
  maxKeys = 500,
}: Opts) {
  const run = async () => {
    const root = document.querySelector(contentSelector) || document.body;
    await refreshBadges(endpoint, root, externalOnly, maxKeys);
  };

  // 首次加载
  queueMicrotask(() => void run());

  // 路由切换后
  router.onAfterRouteChanged = () => {
    setTimeout(() => void run(), 0);
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
