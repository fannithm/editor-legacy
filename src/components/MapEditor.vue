<template>
	<div class="map col row justify-center" style="max-height: calc(100vh - 80px)">
		<template v-if="progress < 100">
			Loading {{ progress.toFixed(2) }}% ...
		</template>
		<div ref="editorRef" class="full-height full-width" style="max-width: 600px"></div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, WatchStopHandle } from 'vue';
import { PJSK } from '@fannithm/editor-core';
import theme from 'assets/editor-theme.json';
import mapState, { updateMapSaved } from 'src/store/map';
import { IMap } from '@fannithm/const/dist/pjsk';
import { getBlobById } from 'src/lib/db/resources';
import { MapResource } from 'src/lib/project';
import editorState from 'src/store/editor';
import { useQuasar } from 'quasar';
import hotkeys from 'hotkeys-js';


const editorRef = ref<null | HTMLDivElement>(null);
const progress = ref<number>(0);
let editor: PJSK.Editor;

const $q = useQuasar();

function changeBPM(oldValue: PJSK.EditorCursorType) {
	$q.dialog({
		title: 'Please input BPM value',
		prompt: {
			model: '120',
			type: 'number'
		},
		cancel: true,
		persistent: true
	}).onOk((data: string) => {
		editor.cursorManager.bpm = parseFloat(data);
		editor.cursorManager.type = editorState.cursor = PJSK.EditorCursorType.BPM;
	}).onCancel(() => {
		editorState.cursor = oldValue;
	});
}

let stops: WatchStopHandle[] = [];

onMounted(async () => {
	editor = new PJSK.Editor(editorRef.value as HTMLDivElement, {
		...theme,
		color: {
			background: 0xf5f5f5
		}
	});

	editorState.editor = editor;

	// load resource
	editor.event.on(PJSK.EventType.ResourceLoadProgress, ({ loader }: PJSK.IResourceLoadProgressEvent) => {
		progress.value = loader.progress;
	});
	editor.event.on(PJSK.EventType.ResourceLoadError, ({ error }: PJSK.IResourceLoadErrorEvent) => {
		console.error('load error:', error);
	});
	await editor.resourceManager.loadResource();

	// load map
	editor.map = mapState.map as IMap;

	// load music
	const music = await getBlobById((mapState.resource as MapResource).music);
	await editor.audioManager.loadAudio(music?.blob as File);
	editorState.totalTime = editor.audioManager.totalTime;

	editor.event.on(PJSK.EventType.AudioTimeUpdate, (event: PJSK.IAudioTimeUpdateEvent) => {
		editorState.currentTime = event.currentTime;
	});

	editor.start();

	stops = [
		watch(() => editorState.cursor, (value, oldValue) => {
			if (value === PJSK.EditorCursorType.BPM) {
				changeBPM(oldValue);
			} else {
				editor.cursorManager.type = editorState.cursor;
			}
		}),
		watch(() => editorState.follow, () => {
			editor.audioManager.follow = editorState.follow;
		}),
		watch(() => editorState.slice, () => {
			editor.beatSlice = editorState.slice;
		})
	];

	hotkeys('ctrl+s', function (event) {
		event.preventDefault();
		alert('you pressed Ctrl+S!');
	});
	/*document.addEventListener('keydown', (event: KeyboardEvent) => {
	 if (!event.altKey) return false;
	 switch (event.key) {
	 case '1':
	 editorState.cursor = PJSK.EditorCursorType.Default;
	 break;
	 case '2':
	 editorState.cursor = PJSK.EditorCursorType.Tap;
	 break;
	 case '3':
	 editorState.cursor = PJSK.EditorCursorType.Flick;
	 break;
	 case '4':
	 editorState.cursor = PJSK.EditorCursorType.Slide;
	 break;
	 case 'b':
	 editorState.cursor = PJSK.EditorCursorType.BPM;
	 break;
	 case 'q':
	 editor.cursorManager.width--;
	 break;
	 case 'e':
	 editor.cursorManager.width++;
	 break;
	 case 'c':
	 editor.cursorManager.critical = !editor.cursorManager.critical;
	 break;
	 case 'r':
	 if (editorState.cursor === PJSK.EditorCursorType.Flick ||
	 (editorState.cursor === PJSK.EditorCursorType.Slide && editor.cursorManager.slideHeadPlaced && editor.cursorManager.flickEnd)) {
	 editor.cursorManager.direction = {
	 [FlickDirection.Up]: FlickDirection.Right,
	 [FlickDirection.Right]: FlickDirection.Left,
	 [FlickDirection.Left]: FlickDirection.Up
	 }[editor.cursorManager.direction];
	 }
	 break;
	 case 'x':
	 if (editorState.cursor === PJSK.EditorCursorType.SlideNode) {
	 editor.cursorManager.nodeVisible = !editor.cursorManager.nodeVisible;
	 }
	 break;
	 case 'v':
	 if ((editorState.cursor === PJSK.EditorCursorType.Slide && editor.cursorManager.slideHeadPlaced) || editorState.cursor === PJSK.EditorCursorType.SlideNode) {
	 editor.cursorManager.curve = {
	 [CurveType.Linear]: CurveType.EaseIn,
	 [CurveType.EaseIn]: CurveType.EaseOut,
	 [CurveType.EaseOut]: CurveType.Linear,
	 [CurveType.None]: CurveType.Linear,
	 [CurveType.EaseInOut]: CurveType.Linear,
	 [CurveType.CubicBezier]: CurveType.Linear
	 }[editor.cursorManager.curve];
	 }
	 break;
	 case 'f':
	 if (editorState.cursor === PJSK.EditorCursorType.Slide && editor.cursorManager.slideHeadPlaced) {
	 editor.cursorManager.flickEnd = !editor.cursorManager.flickEnd;
	 }
	 break;
	 case 'Escape':
	 if (editorState.cursor === PJSK.EditorCursorType.Slide && editor.cursorManager.slideHeadPlaced) {
	 editor.cursorManager.endSlidePlacement();
	 }
	 break;
	 case 'Delete':
	 editor.selectionManager.deleteNotesBySelection(editor.selectionManager.selection);
	 break;
	 }
	 });*/
});
onBeforeUnmount(() => {
	editor.audioManager.stop();
	editor.destroy();
	stops.forEach(v => v());
});


stops.push(watch(
	() => mapState.map,
	() => {
		if (mapState.map !== null) updateMapSaved(false);
	},
	{ deep: true }
));
</script>

<style scoped>

</style>
