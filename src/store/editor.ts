import { reactive } from 'vue';
import { UUID } from '@fannithm/const';
import { PJSK } from '@fannithm/editor-core';

interface EditorStateInterface {
	playing: boolean,
	primeTimeline: UUID,
	visibleTimelines: UUID[],
	cursor: PJSK.EditorCursorType,
	editor: PJSK.Editor | null,
	follow: boolean,
	slice: number,
	currentTime: number,
	totalTime: number
}

const editorState = reactive<EditorStateInterface>({
	playing: false,
	primeTimeline: '',
	visibleTimelines: [],
	cursor: PJSK.EditorCursorType.Default,
	editor: null,
	follow: false,
	slice: 1,
	currentTime: 0,
	totalTime: 60
});


export default editorState;

