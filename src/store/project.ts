import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { computed, reactive } from 'vue';
import { IProject } from 'src/lib/db/db';
import { getRecentProjects } from 'src/lib/db/projects';
import { execCommand } from 'src/lib/commands';
import { closeMap } from 'src/store/map';

interface ProjectStateInterface {
	current: ProjectMetaManager | null;
	saved: boolean;
	recent: IProject[];
}

const projectState = reactive<ProjectStateInterface>({
	current: null,
	saved: false,
	recent: []
});

export default projectState;

export function openProject(metaManager: ProjectMetaManager) {
	projectState.current = metaManager;
}

export function closeProject() {
	closeMap();
	projectState.current = null;
	projectState.saved = true;
}

export function updateProjectSaved(saved: boolean) {
	projectState.saved = saved;
}

export async function updateRecentProject() {
	projectState.recent = await getRecentProjects();
}

export const recentProjectMenu = computed(() => {
	if (projectState.recent.length === 0) return [{ key: 'empty', enable: false }];
	return projectState.recent.map(v => ({
		key: `project-${ v.id || '' }`,
		label: v.name,
		onClick: execCommand('file/openProject', { projectId: v.id as number })
	}));
});
