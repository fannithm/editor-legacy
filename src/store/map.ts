import { reactive } from 'vue';
import { UUID, PJSK } from '@fannithm/const';

interface MapStateInterface {
	map: null | PJSK.IMap,
	id: UUID,
	name: string;
	saved: boolean;
	history: []
}

const mapState = reactive<MapStateInterface>({
	map: null,
	id: '',
	name: '',
	saved: true,
	history: []
});

export function openMap (id: UUID, map: PJSK.IMap, name: string) {
	mapState.id = id;
	mapState.map = map;
	mapState.name = name;
}

export function closeMap () {
	mapState.map = null;
	mapState.id = '';
	mapState.name = '';
}

export default mapState;

