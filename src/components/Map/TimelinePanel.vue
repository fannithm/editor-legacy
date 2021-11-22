<template>
	<div class="column no-wrap">
		<div class="q-px-md q-py-sm text-h6">Timelines</div>
		<div class="text-center q-pb-sm q-gutter-sm">
			<q-btn round flat dense color="primary" icon="mdi-checkbox-marked"
			       @click="displayAll" v-if="visibleTimelines.length !== timelines.length">
				<q-tooltip :delay="500">{{ $t('map.timeline.displayAll') }}</q-tooltip>
			</q-btn>
			<q-btn round flat dense color="primary" icon="mdi-checkbox-intermediate"
			       @click="displayPrime" v-else>
				<q-tooltip :delay="500">{{ $t('map.timeline.displayPrime') }}</q-tooltip>
			</q-btn>
			<q-btn round flat dense color="primary" icon="mdi-plus" @click="add">
				<q-tooltip :delay="500">{{ $t('map.timeline.add') }}</q-tooltip>
			</q-btn>
			<q-btn round flat dense color="primary" @click="sort"
			       :icon="'mdi-sort-variant' + (showDragHandle ? '-remove' : '')">
				<q-tooltip :delay="500">{{ $t(`map.timeline.${ showDragHandle ? 'closeSort' : 'sort' }`) }}</q-tooltip>
			</q-btn>
		</div>
		<div class="overflow-auto">
			<draggable tag="div" class="q-list q-list--separator" :list="timelines" handle=".drag-handle" item-key="id"
			           v-if="timelines">
				<template #item="{ element: timeline }">
					<q-item clickable @click="setPrimeTimeline(timeline.id)" :data-timeline-id="timeline.id">
						<q-item-section side>
							<q-icon name="mdi-drag" class="text-primary drag-handle" v-if="showDragHandle"
							        style="cursor: move;"/>
							<q-checkbox dense v-model="visibleTimelines" :val="timeline.id"
							            :disable="timeline.id === primeTimeline" v-else/>
						</q-item-section>
						<q-item-section>
							<q-item-label>{{ timeline.name }}</q-item-label>
							<q-item-label caption>{{ timeline.id }}</q-item-label>
						</q-item-section>
						<q-item-section side v-if="timeline.id === primeTimeline && !showDragHandle">
							<q-icon name="mdi-check" color="primary"/>
						</q-item-section>
					</q-item>
				</template>
				<template #footer>
					<!--context menu-->
					<Menu touch-position context-menu @before-show="beforeShow"
					      :menu="contextMenu" i18n-global-key="map.timeline"/>
				</template>
			</draggable>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import editorState from 'src/store/editor';
import mapState from 'src/store/map';
import projectState from 'src/store/project';
import Menu from 'src/components/Menu.vue';
import { IMenu } from 'src/lib/menu';
import { useQuasar } from 'quasar';
import { IMapTimeline } from '@fannithm/const/dist/pjsk';
import Draggable from 'vuedraggable';

let timelines = computed(() => {
	return mapState.map?.timelines;
});

const visibleTimelines = computed({
	get: () => editorState.visibleTimelines,
	set: (value: string[]) => editorState.visibleTimelines = value
});
watch(() => visibleTimelines.value, () => {
	if (editorState.editor) editorState.editor.timeLineManager.visible = visibleTimelines.value;
}, { immediate: true });

const primeTimeline = computed({
	get: () => editorState.primeTimeline,
	set: (value: string) => editorState.primeTimeline = value
});
watch(() => primeTimeline.value, () => {
	if (!visibleTimelines.value.includes(primeTimeline.value))
		visibleTimelines.value.push(primeTimeline.value);
	if (editorState.editor) editorState.editor.timeLineManager.prime = primeTimeline.value;
}, { immediate: true });

function setPrimeTimeline(timeline: string) {
	primeTimeline.value = timeline;
}

function displayAll() {
	visibleTimelines.value = <string[]>timelines.value?.map(v => v.id);
}

function displayPrime() {
	visibleTimelines.value = [primeTimeline.value];
}

const contextMenuId = ref('');

function beforeShow(e: MouseEvent) {
	contextMenuId.value = '';
	for (let ele = <HTMLElement>e.target; ele !== document.body; ele = <HTMLElement>ele.parentNode) {
		if (ele.dataset.timelineId) {
			contextMenuId.value = ele.dataset.timelineId;
			break;
		}
	}
}

const $q = useQuasar();

const contextMenu = ref<IMenu>([{
	key: 'displayOnlyThis',
	onClick() {
		visibleTimelines.value = [contextMenuId.value];
		primeTimeline.value = contextMenuId.value;
	}
}, {
	key: 'rename',
	onClick() {
		const timeline = editorState.editor?.map.timelines.find(v => v.id === contextMenuId.value);
		if (!timeline) return;
		$q.dialog({
			title: 'Rename timeline',
			prompt: {
				model: timeline.name,
				type: 'text'
			},
			cancel: true,
			noBackdropDismiss: true
		}).onOk((data: string) => {
			if (!editorState.editor || !projectState.current) return;
			timeline.name = data;
		});
	}
}, {
	key: 'delete',
	onClick() {
		const timelineIndex = editorState.editor?.map.timelines.findIndex(v => v.id === contextMenuId.value);
		if (timelineIndex === undefined || timelineIndex === -1) return;
		const timeline = <IMapTimeline>editorState.editor?.map.timelines[timelineIndex];
		if (contextMenuId.value === primeTimeline.value) {
			$q.dialog({
				title: 'Error',
				message: 'You cannot delete the prime timeline.',
				noBackdropDismiss: true
			});
		} else {
			$q.dialog({
				title: 'Are you sure?',
				message: `This action will delete the timeline ${ timeline.name } (${ timeline.id }) with its all notes.`,
				cancel: true,
				noBackdropDismiss: true
			}).onOk(() => {
				if (editorState.editor) editorState.editor.timeLineManager.deleteTimeline(timeline.id);
				const index = visibleTimelines.value.indexOf(timeline.id);
				console.log(JSON.stringify(visibleTimelines.value), index, timeline.id);
				if (index !== -1) {
					visibleTimelines.value.splice(index, 1);
					console.log(JSON.stringify(visibleTimelines.value));
				}
			});
		}
	},
	separator: true
}, {
	key: 'copyFrom',
	followingStep: true,
	enable: false
}]);

function add() {
	if (!timelines.value) return;
	// find the max timeline number
	let max = 1;
	for (const timeline of timelines.value) {
		const match = /Timeline (\d+)/.exec(timeline.name);
		if (match && match[1]) {
			const num = parseInt(match[1]);
			if (num >= max) {
				max = num + 1;
			}
		}
	}
	$q.dialog({
		title: 'Timeline name',
		prompt: {
			model: `Timeline ${ max }`,
			type: 'text'
		},
		cancel: true,
		noBackdropDismiss: true
	}).onOk((data: string) => {
		if (!editorState.editor || !projectState.current) return;
		const timelineId = projectState.current.getUUID();
		editorState.editor.map.timelines.push({
			id: timelineId,
			name: data
		});
		editorState.editor.map.bpms.push({
			id: projectState.current.getUUID(),
			timeline: timelineId,
			beat: [0, 0, 1],
			bpm: 120
		});
	});
}

const showDragHandle = ref(false);

function sort() {
	showDragHandle.value = !showDragHandle.value;
}
</script>

<style scoped>

</style>
