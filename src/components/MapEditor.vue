<template>
	<div ref="map" class="map col"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	name: 'MapEditor',
	setup () {
		const map = ref<null | HTMLElement>(null);
		onMounted(() => {
			// TODO
			console.log(map);
		});
		return {
			map
		};
	}
});
</script>

<style scoped>

</style>
