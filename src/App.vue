<template>
	<router-view/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'App',
	setup () {
		document.addEventListener('contextmenu', (event) => {
			if (process.env.PROD) {
				event.preventDefault();
			}
		});
	}
});
</script>
