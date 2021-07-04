<template>
	<q-dialog v-model="dialog" persistent>
		<q-card class="bg-grey-2" style="min-width: 720px">
			<q-bar class="bg-primary text-white">
				<div class="non-selectable">{{ title }}</div>
				<q-space/>
				<q-btn dense flat icon="mdi-close" @click="closeWindow">
					<q-tooltip>Close</q-tooltip>
				</q-btn>
			</q-bar>

			<q-card-section>
				<slot/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
	name: 'BasicWindow',
	props: {
		title: {
			type: String,
			required: true
		},
		close: {
			type: Function,
			required: true
		}
	},
	setup (props) {
		const store = useStore();
		const dialog = computed(() => store.state.ui.window.new);

		return {
			dialog,
			closeWindow () {
				props.close();
			}
		};
	}
});
</script>

<style scoped>

</style>
