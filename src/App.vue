<template>
	<router-view/>
</template>
<script lang="ts" setup>
import { bind, unbind } from 'src/lib/hotkey';
import { onBeforeUnmount, onMounted } from 'vue';

document.addEventListener('contextmenu', (event) => {
	if (process.env.PROD) {
		event.preventDefault();
	}
});
onMounted(() => {
	bind();
});

onBeforeUnmount(() => {
	unbind();
});
</script>
