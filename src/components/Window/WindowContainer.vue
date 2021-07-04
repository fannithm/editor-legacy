<template>
	<div>
		<new-window v-model="newWindow"/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import NewWindow from 'components/Window/NewWindow.vue';
import { useStore } from 'src/store';

export default defineComponent({
	name: 'WindowContainer',
	components: { NewWindow },
	setup () {
		const store = useStore();

		return {
			newWindow: computed(() => store.state.ui.window.new)
		};
	}
});
</script>

<style scoped>

</style>
