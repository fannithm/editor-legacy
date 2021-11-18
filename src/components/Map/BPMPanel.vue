<template>
	<div>
		<div class="q-px-md q-py-sm text-h6">
			BPMs
			<q-icon name="mdi-help-circle-outline" size="xs">
				<q-tooltip :delay="500" max-width="200px">
					Only BPMs in prime timeline ({{ primeTimeline.name }}) will be shown.
				</q-tooltip>
			</q-icon>
		</div>
		<q-list separator v-if="bpms">
			<!--context menu-->
			<Menu touch-position context-menu @before-show="beforeShow"
			      :menu="contextMenu" i18n-global-key="map.bpm"/>
			<q-item clickable v-ripple :data-bpm-id="bpm.id" v-for="bpm in bpms" :key="bpm.id"
			        @click="locate(bpm)">
				<q-item-section>
					<q-item-label>{{ beatToTime(bpm) }}</q-item-label>
					<q-item-label caption>Beat: {{ beatToDecimal(bpm.beat) }}</q-item-label>
				</q-item-section>
				<q-item-section side>{{ bpm.bpm }}</q-item-section>
			</q-item>
		</q-list>
	</div>
</template>

<script lang="ts" setup>
import Menu from 'src/components/Menu.vue';
import { computed, reactive, ref } from 'vue';
import { IMenu } from 'src/lib/menu';
import mapState from 'src/store/map';
import { IMapBPM, MapBeat } from '@fannithm/const/dist/pjsk';
import editorState from 'src/store/editor';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const primeTimeline = computed(() => mapState.map?.timelines.find(v => v.id === editorState.primeTimeline));

const bpms = computed(() => mapState.map?.bpms.filter(v => primeTimeline.value && v.timeline === primeTimeline.value.id));

const contextMenuId = ref('');

const contextMenu = reactive<IMenu>([{
	key: 'locate',
	onClick() {
		if (!bpms.value) return;
		const bpm = bpms.value.find(v => v.id === contextMenuId.value);
		if (bpm) locate(bpm);
	}
}, {
	key: 'delete',
	onClick() {
		if (!bpms.value) return;
		const index = bpms.value.findIndex(v => v.id === contextMenuId.value);
		const bpm = bpms.value[index];
		if (bpms.value.length === 1) {
			$q.dialog({
				message: 'You must keep at least 1 BPM',
				persistent: true
			});
		} else if (bpm.beat[0] === 0 && bpm.beat[1] === 0) {
			$q.dialog({
				message: 'The BPM on 00:00.00 is not able to be deleted.',
				persistent: true
			});
		} else {
			if (index !== -1 && mapState.map) {
				mapState.map.bpms.splice(index, 1);
				editorState.editor?.renderer.parseAndRender();
			}
		}
	}
}]);


function beforeShow(e: MouseEvent) {
	contextMenuId.value = '';
	for (let ele = <HTMLElement>e.target; ele !== document.body; ele = <HTMLElement>ele.parentNode) {
		if (ele.dataset.bpmId) {
			contextMenuId.value = ele.dataset.bpmId;
			break;
		}
	}
}

function beatToDecimal(beat: MapBeat): number {
	if (!editorState.editor) return 0;
	return editorState.editor.fraction(beat).decimal;
}

function beatToTime(bpm: IMapBPM): string {
	if (!editorState.editor) return '00:00.000';
	const time = editorState.editor.calculator.getTimeByBeat(editorState.editor.fraction(bpm.beat), bpm.timeline);
	return editorState.editor.parser.formatTime(time);
}

function locate(bpm: IMapBPM) {
	if (!editorState.editor) return;
	const height = editorState.editor.calculator.getHeightByBeat(editorState.editor.fraction(bpm.beat), bpm.timeline);
	editorState.editor.scrollController.scrollTo(height - editorState.editor.const.spaceY);
}
</script>

<style scoped>

</style>
