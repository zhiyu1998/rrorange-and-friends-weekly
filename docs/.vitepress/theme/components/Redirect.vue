<template></template>
<script setup lang="ts">
import { useRouter, useRoute } from "vitepress";

import { createSideBarZH } from "../../utils/createSideBar";

const router = useRouter();

const sideBar = createSideBarZH();
// 如果有base就修改
// const base = "/rrorange-and-friends-weekly"
// const firstItemLink = base + sideBar[0].items[0].link;
const firstItemLink = sideBar[0].items[0].link;

router.go(firstItemLink);
</script>
<style scoped></style>
