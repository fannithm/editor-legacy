<template>
	<div class="map col row justify-center" style="max-height: calc(100vh - 80px)">
		<template v-if="progress < 100">
			Loading {{ progress.toFixed(2) }}% ...
		</template>
		<div ref="editorRef" class="full-height full-width" style="max-width: 600px"></div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, watchEffect, WatchStopHandle } from 'vue';
import { PJSK } from '@fannithm/editor-core';
import theme from 'assets/editor-theme.json';
import mapState, { updateMapSaved } from 'src/store/map';
import { IMap } from '@fannithm/const/dist/pjsk';
import { getBlobById } from 'src/lib/db/resources';
import { MapResource } from 'src/lib/project';
import editorState from 'src/store/editor';
import EditorCursorType = PJSK.EditorCursorType;

const editorRef = ref<null | HTMLDivElement>(null);
const progress = ref<number>(0);
let editor: PJSK.Editor;

let stops: WatchStopHandle[] = [];

const wheelEvent = (event: WheelEvent) => {
	if ((event.shiftKey &&
		[EditorCursorType.Tap, EditorCursorType.Flick, EditorCursorType.Slide, EditorCursorType.SlideNode]
			.includes(editor.cursorManager.type))) {
		if (event.deltaY < 0) {
			editor.cursorManager.width++;
		} else if (event.deltaY > 0) {
			editor.cursorManager.width--;
		}
	}
};


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

	editor.event.on(PJSK.EventType.AudioEnded, () => {
		editorState.playing = false;
	});

	editor.start();

	stops = [
		watchEffect(() => {
			editor.cursorManager.type = editorState.cursor;
		}),
		watchEffect(() => {
			editor.audioManager.follow = editorState.follow;
		}),
		watchEffect(() => {
			editor.beatSlice = editorState.slice;
		})
	];

	editor.renderer.app.view.addEventListener('wheel', wheelEvent);
});
onBeforeUnmount(() => {
	editor.renderer.app.view.removeEventListener('wheel', wheelEvent);
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
