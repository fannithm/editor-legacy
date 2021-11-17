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
			<q-btn round flat dense color="primary" icon="mdi-sort" @click="sort" disable>
				<q-tooltip :delay="500">{{ $t('map.timeline.sort') }}</q-tooltip>
			</q-btn>
		</div>
		<div class="overflow-auto">
			<q-list separator v-if="timelines">
				<!--context menu-->
				<Menu touch-position context-menu @before-show="beforeShow"
				      :menu="contextMenu" i18n-global-key="map.timeline"/>
				<q-item clickable v-for="timeline in timelines" :key="timeline.id"
				        @click="setPrimeTimeline(timeline.id)"
				        :data-timeline-id="timeline.id">
					<q-item-section side>
						<q-checkbox dense v-model="visibleTimelines" :val="timeline.id"
						            :disable="timeline.id === primeTimeline"/>
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
			title: 'Rename timeline name',
			prompt: {
				model: timeline.name,
				type: 'text'
			},
			cancel: true,
			persistent: true
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
				persistent: true
			});
		} else {
			$q.dialog({
				title: 'Are you sure?',
				message: `This action will delete the timeline ${ timeline.name } (${ timeline.id }).`,
				cancel: true,
				persistent: true
			}).onOk(() => {
				editorState.editor?.map.timelines.splice(timelineIndex, 1);
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
	console.log(timelines.value);
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
		persistent: true
	}).onOk((data: string) => {
		if (!editorState.editor || !projectState.current) return;
		editorState.editor.map.timelines.push({
			id: projectState.current.getUUID(),
			name: data
		});
	});
}

function sort() {
	console.log('sort');
}
</script>

<style scoped>

</style>
