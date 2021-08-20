<template>
	<div class="full-width full-height">
		<div class="row" style="height: calc(100% - 48px)">
			<div class="full-height q-py-sm" style="width: 48px; border-right: 1px solid rgba(0, 0, 0, .12)">
				<q-tabs v-model="tab" vertical class="text-primary">
					<q-tab name="timelines" icon="mdi-layers">
						<q-tooltip :delay="500" anchor="center right" self="center left">Timelines</q-tooltip>
					</q-tab>
					<q-tab name="properties" icon="mdi-card-text">
						<q-tooltip :delay="500" anchor="center right" self="center left">Properties</q-tooltip>
					</q-tab>
				</q-tabs>
			</div>
			<q-splitter class="col full-height" v-model="splitter" :limits="[15, 50]">
				<template v-slot:before>
					<div class="text-h6 q-pa-sm" v-if="tab === 'timelines'">
						Timelines
					</div>
					<div class="text-h6 q-pa-sm" v-else-if="tab === 'properties'">
						Properties
					</div>
				</template>
				<template v-slot:after>
					<div class="row full-height">
						<div class="tools q-pa-sm" style="width: 72px">
							<q-btn :unelevated="cursor === 'default'" :outline="cursor !== 'default'"
							       dense color="primary" style="width: 56px;" icon="mdi-cursor-default"
							       @click="cursor = 'default'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Select
								</q-tooltip>
							</q-btn>
							<q-btn :unelevated="cursor === 'tap'" :outline="cursor !== 'tap'"
							       dense color="primary" style="width: 56px;" class="q-mt-sm"
							       @click="cursor = 'tap'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Tap
								</q-tooltip>
								<img src="~assets/notes/tap.png" alt="tap" style="height: 24px;">
							</q-btn>
							<q-btn :unelevated="cursor === 'flick'" :outline="cursor !== 'flick'"
							       dense color="primary" style="width: 56px;" class="q-mt-sm"
							       @click="cursor = 'flick'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Flick
								</q-tooltip>
								<img src="~assets/notes/flick.png" alt="flick" style="height: 24px;">
							</q-btn>
							<q-btn :unelevated="cursor === 'slide'" :outline="cursor !== 'slide'"
							       dense color="primary" style="width: 56px;" class="q-mt-sm"
							       @click="cursor = 'slide'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Slide
								</q-tooltip>
								<img src="~assets/notes/slide.png" alt="slide" style="height: 24px;">
							</q-btn>
							<q-btn :unelevated="cursor === 'node'" :outline="cursor !== 'node'"
							       dense color="primary" style="width: 56px;" class="q-mt-sm"
							       @click="cursor = 'node'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Slide Node
								</q-tooltip>
								<img src="~assets/notes/slide_node.png" alt="slide_node" style="height: 24px;">
							</q-btn>
							<q-btn :unelevated="cursor === 'bpm'" :outline="cursor !== 'bpm'"
							       dense color="primary" style="width: 56px;" class="q-mt-sm"
							       icon="mdi-metronome-tick" @click="cursor = 'bpm'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									BPM
								</q-tooltip>
							</q-btn>
							<q-btn :unelevated="cursor === 'delete'" :outline="cursor !== 'delete'"
							       dense color="primary" style="width: 56px;" class="q-mt-sm"
							       icon="mdi-trash-can-outline" @click="cursor = 'delete'">
								<q-tooltip :delay="500" anchor="center right" self="center left">
									Delete
								</q-tooltip>
							</q-btn>
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
			<q-btn icon="mdi-play" round dense flat/>
			<q-btn icon="mdi-stop" round dense flat class="q-mx-sm"/>
			<div class="text-right" style="width: 80px">00:00.000</div>
			<div class="player-progress relative-position col full-height q-mx-md">
				<div class="player-progress-pointer"></div>
				<div>
					<div class="player-progress-bpm-pointer">180</div>
				</div>
			</div>
			<div class="text-left" style="width: 80px">00:00.000</div>
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MapEditor from 'components/MapEditor.vue';

export default defineComponent({
	name: 'PageMap',
	components: { MapEditor },
	setup () {
		const playRate = ref(100);
		return {
			tab: ref('timelines'),
			splitter: ref(20),
			playRate,
			cursor: ref('default')
		};
	}
});
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
	left: 20%;
	border-left: 4px solid red;
	z-index: 1;
}

.player-progress-bpm-pointer {
	position: absolute;
	height: 24px;
	top: 0;
	left: 15%;
	border-left: 2px solid cyan;
	z-index: 0;
	font-size: 12px;
}
</style>
