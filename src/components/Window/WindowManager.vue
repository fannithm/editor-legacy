<template>
	<div>
		<new-window v-model="newWindow"/>
	</div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import NewWindow from 'components/Window/NewWindow.vue';
import { useStore } from 'vuex';
import { storeKey } from 'src/store';

export default defineComponent({
	name: 'WindowManager',
	components: { NewWindow },
	setup () {
		const store = useStore(storeKey);

		return {
			newWindow: computed(() => store.state.ui.window.new)
		};
	}
});
</script>

<style scoped>

</style>
