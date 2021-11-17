<template>
	<div class="full-width full-height">
		<div class="row" style="height: calc(100% - 48px)">
			<div class="full-height q-py-sm" style="width: 48px; border-right: 1px solid rgba(0, 0, 0, .12)">
				<q-tabs :model-value="tab" vertical class="text-primary">
					<q-tab name="timelines" icon="mdi-layers" @click="switchTab('timelines')">
						<q-tooltip :delay="500" anchor="center right" self="center left">Timelines</q-tooltip>
					</q-tab>
					<q-tab name="properties" icon="mdi-card-text" @click="switchTab('properties')">
						<q-tooltip :delay="500" anchor="center right" self="center left">Properties</q-tooltip>
					</q-tab>
				</q-tabs>
			</div>
			<q-splitter class="col full-height" v-model="splitterValue" :disable="tab === ''"
			            :separator-class="tab === '' ? 'bg-transparent' : ''" :limits="[15, 50]">
				<template v-slot:before>
					<template v-if="tab === 'timelines'">
						<timeline-panel style="max-height: calc(100vh - 80px);"/>
					</template>
					<div class="text-h6 q-pa-sm" v-else-if="tab === 'properties'">
						Properties
					</div>
				</template>
				<template v-slot:after>
					<div class="row full-height">
						<div class="tools q-pa-sm" style="width: 100px">
							<q-btn unelevated :outline="cursor !== EditorCursorType.Default"
							       dense color="primary" style="width: 80px;" icon="mdi-cursor-default"
							       @click="cursor = EditorCursorType.Default">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Select<br>
									Shortcut: 1
								</q-tooltip>
							</q-btn>
							<q-btn unelevated :outline="cursor !== EditorCursorType.Tap"
							       dense color="primary" style="width: 80px;" class="q-mt-sm"
							       @click="cursor = EditorCursorType.Tap">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Tap<br>
									Shortcut: 2
								</q-tooltip>
								<img src="~assets/notes/tap.png" alt="tap" style="height: 24px;">
							</q-btn>
							<q-btn unelevated :outline="cursor !== EditorCursorType.Flick"
							       dense color="primary" style="width: 80px;" class="q-mt-sm"
							       @click="cursor = EditorCursorType.Flick">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Flick<br>
									Shortcut: 3
								</q-tooltip>
								<img src="~assets/notes/flick.png" alt="flick" style="height: 24px;">
							</q-btn>
							<q-btn unelevated :outline="cursor !== EditorCursorType.Slide"
							       dense color="primary" style="width: 80px;" class="q-mt-sm"
							       @click="cursor = EditorCursorType.Slide">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Slide<br>
									Shortcut: 4
								</q-tooltip>
								<img src="~assets/notes/slide.png" alt="slide" style="height: 24px;">
							</q-btn>
							<q-btn unelevated :outline="cursor !== EditorCursorType.BPM"
							       dense color="primary" style="width: 80px;" class="q-mt-sm"
							       icon="mdi-metronome-tick" @click="cursor = EditorCursorType.BPM">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									BPM<br>
									Shortcut: B
								</q-tooltip>
							</q-btn>
							<q-toggle v-model="follow" label="Follow" class="q-mt-sm"/>
							<q-select v-model="slice" :options="sliceOptions" label="Slice"
							          dense options-dense map-options emit-value/>
						</div>
						<map-editor/>
						<div class="minimap" style="width: 100px; background-color: rgba(0, 0, 0, 0.1);">
						</div>
					</div>
				</template>
			</q-splitter>
		</div>
		<div class="player full-width row items-center q-px-md"
		     style="height: 48px; border-top: 1px solid rgba(0, 0, 0, 0.12);">
			<q-btn :icon="playing ? 'mdi-pause' : 'mdi-play'" round dense flat @click="play"/>
			<q-btn icon="mdi-stop" round dense flat class="q-mx-sm" @click="stop"/>
			<div class="text-right" style="width: 80px">{{ formatTime(currentTime) }}</div>
			<div class="player-progress relative-position col full-height q-mx-md">
				<div class="player-progress-pointer" :style="`left: ${ currentTime / totalTime * 100 }%`"></div>
				<div v-if="bpms && editor">
					<div v-for="bpm in bpms" :key="bpm.id">
						<div class="player-progress-bpm-pointer"
						     :style="`left: ${ editor.calculator.getTimeByBeat(editor.fraction(bpm.beat), primeTimeline) / totalTime * 100 }%;`"
						     v-if="bpm.timeline === primeTimeline">{{ bpm.bpm }}
						</div>
					</div>
				</div>
			</div>
			<div class="text-left" style="width: 80px">{{ formatTime(totalTime) }}</div>
			<div class="player-rate q-pl-md">
				<div style="font-size: 12px;" class="text-center">
					Play Rate: {{ playRate }}%
				</div>
				<q-slider color="primary" markers :min="25" :max="100" :step="25" dense snap
				          style="width: 100px; margin-top: -4px;"
				          v-model="playRate"/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MapEditor from 'components/MapEditor.vue';
import TimelinePanel from 'components/Map/TimelinePanel.vue';
import { PJSK } from '@fannithm/editor-core';
import editorState from 'src/store/editor';
import mapState from 'src/store/map';

const EditorCursorType = PJSK.EditorCursorType;

const playRate = ref(100);
const tab = ref('timelines');
const splitter = ref(20);
const cursor = computed<PJSK.EditorCursorType>({
	get: () => editorState.cursor,
	set: value => editorState.cursor = value
});
const follow = computed<boolean>({
	get: () => editorState.follow,
	set: value => editorState.follow = value
});
const slice = computed<number>({
	get: () => editorState.slice,
	set: value => editorState.slice = value
});

const currentTime = computed<number>(() => editorState.currentTime);
const totalTime = computed<number>(() => editorState.totalTime);

const sliceOptions = [
	{ label: '1/1', value: 1 },
	{ label: '1/2', value: 2 },
	{ label: '1/3', value: 3 },
	{ label: '1/4', value: 4 },
	{ label: '1/6', value: 6 },
	{ label: '1/8', value: 8 },
	{ label: '1/12', value: 12 },
	{ label: '1/16', value: 16 },
	{ label: '1/24', value: 24 },
	{ label: '1/32', value: 32 },
	{ label: '1/48', value: 48 },
	{ label: '1/64', value: 64 }
];

const switchTab = (val: string) => {
	tab.value = val !== tab.value ? val : '';
};

const splitterValue = computed({
	get: () => {
		return tab.value === '' ? 0 : splitter.value;
	},
	set: (val: number) => {
		splitter.value = val;
	}
});

function formatTime(time: number) {
	return `${ Math.floor(time / 60).toString().padStart(2, '0') }:${ (time % 60).toFixed(3).padStart(6, '0') }`;
}

const playing = ref(false);

const bpms = computed(() => mapState.map?.bpms);
const primeTimeline = computed(() => editorState.primeTimeline);
const editor = computed(() => editorState.editor);

async function play() {
	if (editorState.editor) {
		if (playing.value) editorState.editor.audioManager.pause();
		else await editorState.editor.audioManager.play();
		playing.value = !playing.value;
	}
}

function stop() {
	if (editorState.editor) editorState.editor.audioManager.stop();
	playing.value = false;
}
</script>

<style scoped>
.player-progress:after {
	content: '';
	border-top: 1px solid #000;
	width: 100%;
	position: absolute;
	top: 24px;
	z-index: -1;
}

.player-progress-pointer {
	position: absolute;
	height: 48px;
	top: 0;
	border-left: 4px solid red;
	z-index: 1;
}

.player-progress-bpm-pointer {
	position: absolute;
	height: 24px;
	top: 0;
	border-left: 2px solid cyan;
	color: cyan;
	font-weight: bold;
	z-index: 0;
	font-size: 12px;
}
</style>
