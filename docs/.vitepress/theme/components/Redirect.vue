<template></template>
<script setup lang="ts">
import { useRouter } from "vitepress";

import { createSideBarZH } from "../../utils/createSideBar";

const router = useRouter();

const sideBar = createSideBarZH();

function findFirstPostLink(items: any[]): string | undefined {
  for (const item of items) {
    if (typeof item?.link === "string" && item.link.startsWith("/posts/")) {
      return item.link;
    }

    if (Array.isArray(item?.items)) {
      const match = findFirstPostLink(item.items);
      if (match) return match;
    }
  }
}

const firstItemLink = findFirstPostLink(sideBar) || "/top-sites";

router.go(firstItemLink);
</script>
<style scoped></style>
