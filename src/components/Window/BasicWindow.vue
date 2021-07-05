<template>
	<q-dialog v-model="showDialog" persistent :maximized="maximized">
		<q-card class="bg-grey-2" style="width: 100%">
			<q-bar class="bg-primary text-white">
				<div class="non-selectable">{{ title }}</div>
				<q-space/>
				<q-btn dense flat :icon="maximized ? 'mdi-window-restore' : 'mdi-window-maximize'"
				       @click="maximized = !maximized">
					<q-tooltip :delay="500">{{ maximized ? 'Restore' : 'Maximize' }}</q-tooltip>
				</q-btn>
				<q-btn dense flat icon="mdi-close" @click="$emit('close')">
					<q-tooltip :delay="500">Close</q-tooltip>
				</q-btn>
			</q-bar>

			<q-card-section>
				<slot/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'BasicWindow',
	props: {
		show: {
			type: Boolean,
			required: true
		},
		title: {
			type: String,
			required: true
		}
	},
	setup (props) {
		return {
			showDialog: computed(() => props.show),
			maximized: ref(false)
		};
	}
});
</script>

<style scoped>

</style>
