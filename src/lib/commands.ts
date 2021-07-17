import { getMetaResource } from 'src/lib/resourceManager';
import ProjectManager, { deleteProjectById, getProjectById } from 'src/lib/projectManager';
import { store } from 'src/store';
import { Dialog, openURL } from 'quasar';
import { openNewWindow, openOpenWindow } from 'src/lib/windowManager';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import { db, IProject } from 'src/lib/db';
import { errorHandler, randomInt } from 'src/lib/utils';
import SaveDialog from 'components/SaveDialog.vue';


export function execCommand (command: 'file/newProjectWindow'): () => void;
export function execCommand (command: 'file/openProjectWindow'): () => void;
export function execCommand (command: 'file/openProject', args: File_OpenProject_Args): () => Promise<void>;
export function execCommand (command: 'file/closeProject'): () => void;
export function execCommand (command: 'file/save'): () => void;
export function execCommand (command: 'file/deleteProject', args: File_OpenProject_Args): () => Promise<void>;
export function execCommand (command: 'file/clearData'): () => void;

export function execCommand (command: 'help/documentation'): () => void;
export function execCommand (command: 'help/github'): () => void;

export function execCommand (command: string, args?: unknown) {
	switch (command) {
		case 'file/newProjectWindow':
			return () => file_newProjectWindow();
		case 'file/openProjectWindow':
			return () => file_openProjectWindow();
		case 'file/openProject':
			return () => file_openProject((args as File_OpenProject_Args).projectId);
		case 'file/closeProject':
			return () => file_closeProject();
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
;

export function file_newProjectWindow () {
	openNewWindow();
}

export function file_openProjectWindow () {
	openOpenWindow();
}

export async function file_openProject (projectId: number) {
	const meta = await getMetaResource(projectId);
	if (meta === undefined) return;
	const data = await meta.blob.text();
	const project = ProjectManager.parseJSON(JSON.parse(data));
	store.commit('project/openProject', project);
	store.commit('project/updateSaved', true);
}

export function file_save () {
	// TODO save project
	store.commit('project/updateSaved', true);
}

export function file_closeProject () {
	if (store.state.project.current === null) return;
	if (!store.state.project.saved) {
		Dialog.create({
			component: SaveDialog
		}).onOk(() => {
			file_save();
			store.commit('project/closeProject');
		}).onCancel(() => {
			store.commit('project/closeProject');
		});
	}
	store.commit('project/closeProject');
}

export async function file_deleteProject (projectId: number) {
	return new Promise<void>(resolve => {
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
					await deleteProjectById(projectId);
					await store.dispatch('project/updateRecentProject');
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
