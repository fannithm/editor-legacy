import { getMetaResource } from 'src/lib/resourceManager';
import ProjectManager from 'src/lib/projectManager';
import { store } from 'src/store';

export async function execCommand (command: 'file/open', args: { projectId: number }): Promise<void>;

export async function execCommand (command: string, args?: unknown) {
	if (command === 'file/open') {
		return file_open((args as { projectId: number }).projectId);
	}
}

export async function file_open (projectId: number) {
	const meta = await getMetaResource(projectId);
	if (meta === undefined) return;
	const data = await meta.blob.text();
	const project = ProjectManager.parseJSON(JSON.parse(data));
	store.commit('project/openProject', project);
}
