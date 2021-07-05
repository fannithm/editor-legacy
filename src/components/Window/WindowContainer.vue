<template>
	<div>
		<basic-window title="New Project" :show="newWindow" @close="closeNewWindow">
			<new-window/>
		</basic-window>
		<basic-window title="Open Project" :show="openWindow" @close="closeOpenWindow">
			<open-window/>
		</basic-window>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import BasicWindow from 'components/Window/BasicWindow.vue';
import NewWindow from 'components/Window/NewWindow.vue';
import OpenWindow from 'components/Window/OpenWindow.vue';
import { useStore } from 'src/store';
import { closeNewWindow, closeOpenWindow } from 'src/lib/windowManager';

export default defineComponent({
	name: 'WindowContainer',
	components: { BasicWindow, OpenWindow, NewWindow },
	setup () {
		const store = useStore();

		return {
			closeNewWindow,
			closeOpenWindow,
			newWindow: computed(() => store.state.ui.window.new),
			openWindow: computed(() => store.state.ui.window.open)
		};
	}
});
</script>

<style scoped>

</style>
