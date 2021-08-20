import { reactive } from 'vue';
import { UUID, PJSK } from '@fannithm/const';

interface MapStateInterface {
	map: null | PJSK.IMap,
	id: UUID,
	history: []
}

const mapState = reactive<MapStateInterface>({
	map: null,
	id: '',
	history: []
});

export function openMap (id: UUID, map: PJSK.IMap) {
	mapState.id = id;
	mapState.map = map;
}

export function closeMap () {
	mapState.map = null;
	mapState.id = '';
}

export default mapState;

