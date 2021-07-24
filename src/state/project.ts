import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { reactive } from 'vue';

interface ProjectStateInterface {
	current: ProjectMetaManager | null;
	saved: boolean;
}

const projectState = reactive<ProjectStateInterface>({
	current: null,
	saved: false
});

export default projectState;

export function openProject (metaManager: ProjectMetaManager) {
	projectState.current = metaManager;
}

export function closeProject () {
	projectState.current = null;
}

export function updateSaved (saved: boolean) {
	projectState.saved = saved;
}
