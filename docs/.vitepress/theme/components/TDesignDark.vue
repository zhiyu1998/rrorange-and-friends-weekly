<template></template>
<script setup lang="ts">
import { useData, inBrowser } from "vitepress";
import { watch } from "vue";

const { isDark } = useData();

// tdesign暗色切换 https://tdesign.tencent.com/vue-next/dark-mode
watch(
	isDark,
	() => {
		// SSR（build）阶段没有 document，跳过避免 "document is not defined" 报错
		if (!inBrowser) return;
    if(isDark.value) {
      document.documentElement.setAttribute('theme-mode', 'dark');
    } else {
      document.documentElement.removeAttribute('theme-mode');
    }
	},
	{
		immediate: true,
	}
);

</script>
