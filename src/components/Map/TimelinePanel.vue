<template>
	<q-list separator v-if="timelines">
		<q-item clickable v-for="timeline in timelines" :key="timeline.id">
			<q-item-section side>
				<q-radio v-model="primeTimeline" :val="timeline.id"/>
			</q-item-section>
			<q-item-section>
				<q-item-label>{{ timeline.name }}</q-item-label>
				<q-item-label caption>{{ timeline.id }}</q-item-label>
			</q-item-section>
			<q-item-section side>
				<div>
					<q-btn class="q-ml-sm" icon="mdi-eye-off" text-color="primary" flat round size="12px">
						<q-tooltip :delay="500">Hide timeline</q-tooltip>
					</q-btn>
				</div>
			</q-item-section>
		</q-item>
	</q-list>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import editorState from 'src/store/editor';
import mapState from 'src/store/map';

let timelines;

watch(
	() => mapState.map?.timelines,
	() => {
		if (mapState.map) timelines = mapState.map.timelines;
	},
	{ deep: true, immediate: true }
);
const primeTimeline = computed({
	get: () => editorState.primeTimeline,
	set: (value: string) => {
		editorState.primeTimeline = value;
		if (editorState.editor) editorState.editor.timeLineManager.prime = value;
	}
});

</script>

<style scoped>

</style>
