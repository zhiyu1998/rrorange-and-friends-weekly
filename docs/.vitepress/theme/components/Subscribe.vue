<template>
	<t-popup placement="right" show-arrow destroy-on-close>
		<template #content>
			<div class="img-container">
				<img src="https://i.imgur.com/b6IpckJ.png" alt="" />
			</div>
		</template>
		<t-button theme="default" variant="dashed" style="margin-bottom: 10px" @click="jumpToMedium">
			<template #icon><NotificationIcon /></template>
			订阅本周刊（Telegram）
		</t-button>
	</t-popup>
</template>
<script setup lang="ts">
import { NotificationIcon } from "tdesign-icons-vue-next";

function jumpToMedium() {
	window.open("https://t.me/RrOrangeAndFriends", "_blank");
}
</script>
<style scoped>
.img-container {
	height: 105px;
	width: 100px;
}

img {
	height: 100px;
	border-radius: 5px;
	margin-top: 5px;
}
</style>
