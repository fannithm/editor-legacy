<template>
	<div>
		<div class="text-center">
			<q-btn round flat dense color="primary" icon="mdi-plus">
				<q-tooltip :delay="500">Add a new timeline</q-tooltip>
			</q-btn>
		</div>
		<q-list separator v-if="timelines">
			<q-item clickable v-for="timeline in timelines" :key="timeline.id" @click="setPrimeTimeline(timeline.id)">
				<q-item-section side>
					<q-checkbox dense v-model="displayTimelines" :val="timeline.id"/>
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ timeline.name }}</q-item-label>
					<q-item-label caption>{{ timeline.id }}</q-item-label>
				</q-item-section>
				<q-item-section side v-if="timeline.id === primeTimeline">
					<q-icon name="mdi-check" color="primary"/>
				</q-item-section>
			</q-item>
		</q-list>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
const displayTimelines = ref([]);
const primeTimeline = computed({
	get: () => editorState.primeTimeline,
	set: (value: string) => {
		editorState.primeTimeline = value;
		if (editorState.editor) editorState.editor.timeLineManager.prime = value;
	}
});

function setPrimeTimeline(timeline: string) {
	primeTimeline.value = timeline;
}

</script>

<style scoped>

</style>
