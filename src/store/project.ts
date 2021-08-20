import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { computed, reactive } from 'vue';
import { IProject } from 'src/lib/db/db';
import { getRecentProjects } from 'src/lib/db/projects';
import { execCommand } from 'src/lib/commands';

interface ProjectStateInterface {
	current: ProjectMetaManager | null;
	saved: boolean;
	recent: IProject[]
}

const projectState = reactive<ProjectStateInterface>({
	current: null,
	saved: false,
	recent: []
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

export async function updateRecentProject () {
	projectState.recent = await getRecentProjects();
}

export const recentProjectMenu = computed(() => {
	if (projectState.recent.length === 0) return [{ name: 'Empty', disabled: true }];
	return projectState.recent.map(v => ({
		name: v.name,
		click: execCommand('file/openProject', { projectId: v.id as number })
	}));
});
