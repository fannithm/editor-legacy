import { getMetaResource, updateBlobById } from 'src/lib/db/resources';
import { deleteProjectById, getProjectById } from 'src/lib/db/projects';
import { Dialog, openURL } from 'quasar';
import {
	openNewMapWindow,
	openNewProjectWindow,
	openOpenProjectWindow,
	openResourceManagerWindow
} from 'src/lib/windowManager';
import ConfirmDialog from 'components/Dialog/ConfirmDialog.vue';
import { db, IProject } from 'src/lib/db/db';
import { errorHandler, randomInt } from 'src/lib/utils';
import SaveDialog from 'components/Dialog/SaveDialog.vue';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import projectState, { closeProject, openProject, updateProjectSaved, updateRecentProject } from 'src/store/project';
import mapState, { closeMap, updateMapSaved } from 'src/store/map';


export function execCommand(command: 'file/newProjectWindow'): () => void;
export function execCommand(command: 'file/openProjectWindow'): () => void;
export function execCommand(command: 'file/newMapWindow'): () => void;
export function execCommand(command: 'file/openProject', args: File_OpenProject_Args): () => Promise<void>;
export function execCommand(command: 'file/closeMap'): () => void;
export function execCommand(command: 'file/closeProject'): () => void;
export function execCommand(command: 'file/resourceManagerWindow'): () => void;
export function execCommand(command: 'file/save'): () => void;
export function execCommand(command: 'file/deleteProject', args: File_OpenProject_Args): () => Promise<void>;
export function execCommand(command: 'file/clearData'): () => void;

export function execCommand(command: 'help/documentation'): () => void;
export function execCommand(command: 'help/github'): () => void;
export function execCommand(command: 'help/discord'): () => void;

export function execCommand(command: string, args?: unknown) {
	switch (command) {
		case 'file/newProjectWindow':
			return () => file_newProjectWindow();
		case 'file/newMapWindow':
			return () => file_newMapWindow();
		case 'file/openProjectWindow':
			return () => file_openProjectWindow();
		case 'file/openProject':
			return () => file_openProject((args as File_OpenProject_Args).projectId);
		case 'file/closeMap':
			return () => file_closeMap();
		case 'file/closeProject':
			return () => file_closeProject();
		case 'file/resourceManagerWindow':
			return () => file_resourceManagerWindow();
		case 'file/save':
			return () => file_save();
		case 'file/deleteProject':
			return () => file_deleteProject((args as File_OpenProject_Args).projectId);
		case 'file/clearData':
			return () => file_clearData();
		case 'help/documentation':
			return () => help_documentation();
		case 'help/github':
			return () => help_github();
		case 'help/discord':
			return () => help_discord();
	}
}

interface File_OpenProject_Args {
	projectId: number;
}

export function file_newProjectWindow() {
	openNewProjectWindow();
}

export function file_newMapWindow() {
	openNewMapWindow();
}

export function file_openProjectWindow() {
	openOpenProjectWindow();
}

export async function file_openProject(projectId: number) {
	// TODO check if project haven't been saved
	if (!projectState.saved) {

	}
	const meta = await getMetaResource(projectId);
	const project = await getProjectById(projectId);
	if (meta === undefined || project === undefined)
		throw `no project found, id: ${ projectId }`;
	const data = await meta.blob.text();
	const metaManager = ProjectMetaManager.parseJSON(project, JSON.parse(data));
	openProject(metaManager);
	updateProjectSaved(true);
}

export function file_resourceManagerWindow() {
	openResourceManagerWindow();
}

export async function file_save() {
	if (!mapState.saved) {
		await updateBlobById(mapState.id, new Blob([
			JSON.stringify(mapState.map)
		], { type: 'application/json' }));
		updateMapSaved(true);
	}
	if (!projectState.saved) {
		const metaManager = projectState.current as ProjectMetaManager;
		await metaManager.save();
		updateProjectSaved(true);
	}
}

export function file_closeMap() {
	return new Promise<void>((resolve) => {
		if (mapState.map === null) resolve();
		if (!mapState.saved) {
			Dialog.create({
				component: SaveDialog,
				componentProps: {
					name: 'map'
				}
			}).onOk(async (save: boolean) => {
				if (save) await file_save();
				closeMap();
				resolve();
			});
		} else {
			closeMap();
			resolve();
		}
	});

}

export async function file_closeProject() {
	await file_closeMap();
	if (projectState.current === null) return;
	if (!projectState.saved) {
		Dialog.create({
			component: SaveDialog,
			componentProps: {
				name: 'project'
			}
		}).onOk(async (save: boolean) => {
			if (save) await file_save();
			closeProject();
		});
	} else {
		closeProject();
	}
}

export async function file_deleteProject(projectId: number) {
	return new Promise<void>(resolve => {
		// TODO (future) cross tab detect
		if (projectId === projectState.current?.project.id) {
			Dialog.create({
				title: 'Alert',
				message: 'You have opened this project, please close it before delete it.',
				persistent: true
			});
			return resolve();
		}
		getProjectById(projectId).then(project => {
			const name = (project as IProject).name;
			Dialog.create({
				title: 'Are you absolutely sure?',
				component: ConfirmDialog,
				componentProps: {
					text: `This will permanently delete the ${ name } project with all its resources.`,
					display: name,
					value: name
				}
			}).onOk(async () => {
				try {
					const num = await deleteProjectById(projectId);
					await updateRecentProject();
					Dialog.create({
						title: 'Alert',
						message: `Deleted ${ name } project and its ${ num } resources.`,
						persistent: true
					});
					resolve();
				} catch (e) {
					errorHandler(e);
				}
			});
		}).catch(errorHandler);
	});
}

export function file_clearData() {
	const a = randomInt();
	const b = randomInt();
	Dialog.create({
		component: ConfirmDialog,
		componentProps: {
			text: 'This action will clear all your local data including your maps and resources. Be sure you have backup what you need. ',
			display: `the result of ${ a } + ${ b }`,
			value: (a + b).toString()
		}
	}).onOk(async () => {
		await db.delete();
		Dialog.create({
			title: 'Succeeded',
			message: 'You need to restart the app to make the changes take effect.'
		}).onOk(() => {
			window.location.reload();
		});
	});
}


export function help_documentation() {
	openURL('https://www.notion.so/Fannithm-Editor-Documentation-b72c519a9b574432beac536fd99577fd');
}

export function help_github() {
	openURL('https://github.com/Fannithm/Editor');
}

export function help_discord() {
	openURL('https://discord.gg/fDTtRJCyBP');
}
