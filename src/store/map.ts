import { reactive } from 'vue';
import { PJSK as PJSKConst, UUID } from '@fannithm/const';
import { MapResource } from 'src/lib/project';
import editorState from 'src/store/editor';
import { PJSK } from '@fannithm/editor-core';
import EditorCursorType = PJSK.EditorCursorType;

interface MapStateInterface {
	map: null | PJSKConst.IMap,
	resource: null | MapResource,
	id: UUID,
	name: string;
	saved: boolean;
	history: []
}

const mapState = reactive<MapStateInterface>({
	map: null,
	resource: null,
	id: '',
	name: '',
	saved: true,
	history: []
});

export function openMap(id: UUID, map: PJSKConst.IMap, resource: MapResource, name: string) {
	mapState.id = id;
	mapState.map = map;
	editorState.primeTimeline = map.timelines[0].id;
	mapState.resource = resource;
	mapState.name = name;
}

export function closeMap() {
	mapState.map = null;
	mapState.id = '';
	mapState.name = '';
	mapState.saved = true;
	editorState.cursor = EditorCursorType.Default;
	editorState.playing = false;
	editorState.editor = null;
	editorState.primeTimeline = '';
	editorState.visibleTimelines = [];
	editorState.currentTime = 0;
	editorState.totalTime = 0;
}

export function updateMapSaved(saved: boolean) {
	mapState.saved = saved;
}

export default mapState;

