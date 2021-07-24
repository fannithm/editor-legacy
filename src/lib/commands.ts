import { getMetaResource } from 'src/lib/db/resources';
import { deleteProjectById, getProjectById } from 'src/lib/db/projects';
import { store } from 'src/store';
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
import projectState, { closeProject, openProject, updateSaved } from 'src/state/project';


export function execCommand (command: 'file/newProjectWindow'): () => void;
export function execCommand (command: 'file/openProjectWindow'): () => void;
export function execCommand (command: 'file/newMapWindow'): () => void;
export function execCommand (command: 'file/openProject', args: File_OpenProject_Args): () => Promise<void>;
export function execCommand (command: 'file/closeProject'): () => void;
export function execCommand (command: 'file/resourceManagerWindow'): () => void;
export function execCommand (command: 'file/save'): () => void;
export function execCommand (command: 'file/deleteProject', args: File_OpenProject_Args): () => Promise<void>;
export function execCommand (command: 'file/clearData'): () => void;

export function execCommand (command: 'help/documentation'): () => void;
export function execCommand (command: 'help/github'): () => void;

export function execCommand (command: string, args?: unknown) {
	switch (command) {
		case 'file/newProjectWindow':
			return () => file_newProjectWindow();
		case 'file/newMapWindow':
			return () => file_newMapWindow();
		case 'file/openProjectWindow':
			return () => file_openProjectWindow();
		case 'file/openProject':
			return () => file_openProject((args as File_OpenProject_Args).projectId);
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
	}
}

interface File_OpenProject_Args {
	projectId: number
}

export function file_newProjectWindow () {
	openNewProjectWindow();
}

export function file_newMapWindow () {
	openNewMapWindow();
}

export function file_openProjectWindow () {
	openOpenProjectWindow();
}

export async function file_openProject (projectId: number) {
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
	updateSaved(true);
}

export function file_resourceManagerWindow () {
	openResourceManagerWindow();
}

export async function file_save () {
	const metaManager = projectState.current as ProjectMetaManager;
	await metaManager.save();
	updateSaved(true);
}

export function file_closeProject () {
	if (projectState.current === null) return;
	if (!projectState.saved) {
		Dialog.create({
			component: SaveDialog
		}).onOk(async (save: boolean) => {
			if (save) await file_save();
			closeProject();
		});
	} else {
		closeProject();
	}
}

export async function file_deleteProject (projectId: number) {
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
					await store.dispatch('project/updateRecentProject');
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

export function file_clearData () {
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


export function help_documentation () {
	openURL('https://www.notion.so/Fannithm-Editor-Documentation-b72c519a9b574432beac536fd99577fd');
}

export function help_github () {
	openURL('https://github.com/Fannithm/Editor');
}
