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

<script>
import { computed, defineComponent } from 'vue';
import { storeKey } from 'src/store';
import { useStore } from 'vuex';

export default defineComponent({
	name: 'BasicWindow',
	props: {
		title: {
			type: String,
			required: true
		},
		close: {
			type: String,
			required: true
		}
	},
	setup (props) {
		const store = useStore(storeKey);
		const dialog = computed(() => store.state.ui.window.new);

		return {
			dialog,
			closeWindow () {
				store.commit(`ui/${ props.close }`);
			}
		};
	}
});
</script>

<style scoped>

</style>
