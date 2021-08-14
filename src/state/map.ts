import { reactive } from 'vue';
import { MapFile, UUID } from 'src/lib/project';

interface MapStateInterface {
	map: null | MapFile,
	id: UUID,
	history: []
}

const mapState = reactive<MapStateInterface>({
	map: null,
	id: '',
	history: []
});

export function openMap (id: UUID, map: MapFile) {
	mapState.id = id;
	mapState.map = map;
}

export default mapState;

