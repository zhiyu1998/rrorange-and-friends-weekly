<template>
  <section class="top-sites">
    <div class="top-sites__toolbar">
      <div class="top-sites__intro">
        <p class="top-sites__eyebrow">Hot Picks</p>
        <p class="top-sites__description">
          只统计周刊主推荐条目，按同一网站跨期合并点击数排序。
        </p>
      </div>

      <label class="top-sites__filter">
        <span>显示范围</span>
        <select v-model="selectedLimit" class="top-sites__select">
          <option :value="10">Top 10</option>
          <option :value="50">Top 50</option>
        </select>
      </label>
    </div>

    <div v-if="isLoading" class="top-sites__state">
      正在加载热门网站榜...
    </div>

    <div v-else-if="errorMessage" class="top-sites__state top-sites__state--error">
      {{ errorMessage }}
    </div>

    <div v-else-if="!rankedSites.length" class="top-sites__state">
      还没有可展示的主推荐站点。
    </div>

    <div v-else class="top-sites__content">
      <div v-if="isZeroState" class="top-sites__state top-sites__state--soft">
        目前还没有累计点击数据，先把这份榜单当作精选导航用也不错。
      </div>

      <p class="top-sites__summary">
        当前显示前 {{ visibleSites.length }} 个站点，共收录 {{ rankedSites.length }} 个网站。
      </p>

      <ol class="top-sites__list">
        <li
          v-for="(site, index) in visibleSites"
          :key="site.href"
          class="top-sites__item"
        >
          <div class="top-sites__rank">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div class="top-sites__body">
            <a
              :href="site.href"
              target="_blank"
              rel="noreferrer"
              class="top-sites__title"
            >
              {{ site.title }}
            </a>

            <p class="top-sites__meta">
              <span>{{ site.domain }}</span>
              <span>最近收录于</span>
              <a :href="site.pagePath" class="top-sites__source">
                {{ site.issueTitle }}
              </a>
            </p>
          </div>

          <div class="top-sites__aside">
            <div class="top-sites__count">
              {{ formatCount(site.totalCount) }} 次点击
            </div>

            <div class="top-sites__actions">
              <a :href="site.href" target="_blank" rel="noreferrer">访问网站</a>
              <a :href="site.pagePath">查看来源</a>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { data as curatedLinks } from "../data/top-sites.data.mts";
import type { CuratedLinkEntry } from "../data/top-sites.data.mts";

type RankedSiteEntry = {
  href: string;
  title: string;
  totalCount: number;
  pagePath: string;
  issueTitle: string;
  date: string;
  domain: string;
};

type BatchResponse = {
  ok: boolean;
  counts: Record<string, number>;
};

const ENDPOINT = "https://vp-link-counter.rrorangeandfriends.de";
const BATCH_SIZE = 500;

const selectedLimit = ref<10 | 50>(10);
const isLoading = ref(true);
const errorMessage = ref("");
const rankedSites = ref<RankedSiteEntry[]>([]);

const visibleSites = computed(() =>
  rankedSites.value.slice(0, selectedLimit.value)
);

const isZeroState = computed(
  () => rankedSites.value.length > 0 && rankedSites.value[0].totalCount === 0
);

function chunk<T>(items: T[], size: number) {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

function getDomain(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function formatCount(count: number) {
  return new Intl.NumberFormat("zh-CN").format(count);
}

function isNewerEntry(a: CuratedLinkEntry, b: CuratedLinkEntry) {
  return +new Date(a.date) > +new Date(b.date);
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

async function fetchCounts(keys: string[]) {
  const counts: Record<string, number> = {};
  const keyChunks = chunk(keys, BATCH_SIZE);

  for (const keyGroup of keyChunks) {
    const data = await postJson<BatchResponse>(`${ENDPOINT}/batch`, {
      keys: keyGroup,
    });

    if (!data.ok) {
      throw new Error("batch request failed");
    }

    Object.assign(counts, data.counts);
  }

  return counts;
}

function buildRankedSites(entries: CuratedLinkEntry[], counts: Record<string, number>) {
  const grouped = new Map<
    string,
    {
      latestEntry: CuratedLinkEntry;
      totalCount: number;
      seenKeys: Set<string>;
    }
  >();

  for (const entry of entries) {
    const existing = grouped.get(entry.href);

    if (!existing) {
      const seenKeys = new Set<string>();
      seenKeys.add(entry.key);

      grouped.set(entry.href, {
        latestEntry: entry,
        totalCount: counts[entry.key] ?? 0,
        seenKeys,
      });
      continue;
    }

    if (isNewerEntry(entry, existing.latestEntry)) {
      existing.latestEntry = entry;
    }

    if (!existing.seenKeys.has(entry.key)) {
      existing.seenKeys.add(entry.key);
      existing.totalCount += counts[entry.key] ?? 0;
    }
  }

  return Array.from(grouped.values())
    .map(({ latestEntry, totalCount }) => ({
      href: latestEntry.href,
      title: latestEntry.title,
      totalCount,
      pagePath: latestEntry.pagePath,
      issueTitle: latestEntry.issueTitle,
      date: latestEntry.date,
      domain: getDomain(latestEntry.href),
    }))
    .sort((a, b) => {
      if (b.totalCount !== a.totalCount) {
        return b.totalCount - a.totalCount;
      }

      return +new Date(b.date) - +new Date(a.date);
    });
}

onMounted(async () => {
  try {
    const uniqueKeys = Array.from(new Set(curatedLinks.map((entry) => entry.key)));
    const counts = await fetchCounts(uniqueKeys);
    rankedSites.value = buildRankedSites(curatedLinks, counts);
  } catch (error) {
    console.error("[top-sites] failed to load rankings:", error);
    errorMessage.value = "热门网站榜加载失败，请稍后再试。";
  } finally {
    isLoading.value = false;
  }
});
</script>
