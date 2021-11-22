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
import editorState from 'src/store/editor';
import { PJSK } from '@fannithm/editor-core';
import { CurveType, FlickDirection } from '@fannithm/const/dist/pjsk';
import EditorCursorType = PJSK.EditorCursorType;

export function file_newProjectWindow() {
	openNewProjectWindow();
}

export function file_newMapWindow() {
	openNewMapWindow();
}

export function file_openProjectWindow() {
	openOpenProjectWindow();
}

export interface File_OpenProject_Args {
	projectId: number;
}

export async function file_openProject(args: File_OpenProject_Args) {
	// TODO check if project haven't been saved
	if (!projectState.saved) {

	}
	const meta = await getMetaResource(args.projectId);
	const project = await getProjectById(args.projectId);
	if (meta === undefined || project === undefined)
		throw `no project found, id: ${ args.projectId }`;
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

export async function file_deleteProject(args: File_OpenProject_Args) {
	return new Promise<void>(resolve => {
		// TODO (future) cross tab detect
		if (args.projectId === projectState.current?.project.id) {
			Dialog.create({
				title: 'Alert',
				message: 'You have opened this project, please close it before delete it.',
				noBackdropDismiss: true
			});
			return resolve();
		}
		getProjectById(args.projectId).then(project => {
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
					const num = await deleteProjectById(args.projectId);
					await updateRecentProject();
					Dialog.create({
						title: 'Alert',
						message: `Deleted ${ name } project and its ${ num } resources.`,
						noBackdropDismiss: true
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

export function edit_delete() {
	if (editorState.editor)
		editorState.editor.selectionManager.deleteNotesBySelection(editorState.editor.selectionManager.selection);
}

export function control_toggleCritical() {
	if (editorState.editor) editorState.editor.cursorManager.critical = !editorState.editor.cursorManager.critical;
}

export function control_toggleDirection() {
	if (editorState.editor) editorState.editor.cursorManager.direction = editorState.editor.cursorManager.direction = {
		[FlickDirection.Up]: FlickDirection.Right,
		[FlickDirection.Right]: FlickDirection.Left,
		[FlickDirection.Left]: FlickDirection.Up
	}[editorState.editor.cursorManager.direction];
}

export function control_toggleCurve() {
	if (editorState.editor &&
		((editorState.editor.cursorManager.type === EditorCursorType.Slide && editorState.editor.cursorManager.slideHeadPlaced) ||
			editorState.editor.cursorManager.type === EditorCursorType.SlideNode)) {
		editorState.editor.cursorManager.curve = {
			[CurveType.Linear]: CurveType.EaseIn,
			[CurveType.EaseIn]: CurveType.EaseOut,
			[CurveType.EaseOut]: CurveType.Linear,
			[CurveType.None]: CurveType.Linear,
			[CurveType.EaseInOut]: CurveType.Linear,
			[CurveType.CubicBezier]: CurveType.Linear
		}[editorState.editor.cursorManager.curve];
	}
}

export function control_toggleVisible() {
	if (editorState.editor && editorState.cursor === EditorCursorType.SlideNode) {
		editorState.editor.cursorManager.nodeVisible = !editorState.editor.cursorManager.nodeVisible;
	}
}

export function control_toggleFlick() {
	if (editorState.editor && editorState.cursor === EditorCursorType.Slide && editorState.editor.cursorManager.slideHeadPlaced) {
		editorState.editor.cursorManager.flickEnd = !editorState.editor.cursorManager.flickEnd;
	}
}

export function control_cancelSlide() {
	if (editorState.editor && editorState.cursor === PJSK.EditorCursorType.Slide && editorState.editor.cursorManager.slideHeadPlaced) {
		editorState.editor.cursorManager.endSlidePlacement();
	}
}

export function control_cursor_default() {
	editorState.cursor = EditorCursorType.Default;
}

export function control_cursor_tap() {
	editorState.cursor = EditorCursorType.Tap;
}

export function control_cursor_flick() {
	editorState.cursor = EditorCursorType.Flick;
}

export function control_cursor_slide() {
	editorState.cursor = EditorCursorType.Slide;
}

export function control_cursor_bpm() {
	Dialog.create({
		title: 'Please input BPM value',
		prompt: {
			model: '120',
			type: 'number'
		},
		cancel: true,
		noBackdropDismiss: true
	}).onOk((data: string) => {
		if (editorState.editor) editorState.editor.cursorManager.bpm = parseFloat(data);
		editorState.cursor = EditorCursorType.BPM;
		// editor.cursorManager.type = editorState.cursor = PJSK.EditorCursorType.BPM;
	});
}

export async function control_playOrPause() {
	if (editorState.editor) {
		if (editorState.playing) editorState.editor.audioManager.pause();
		else await editorState.editor.audioManager.play();
		editorState.playing = !editorState.playing;
	}
}

export function control_stop() {
	if (editorState.editor) {
		editorState.editor.audioManager.stop();
		editorState.playing = false;
	}
}

export function help_documentation() {
	openURL('https://www.notion.so/Fannithm-Editor-Documentation-b72c519a9b574432beac536fd99577fd');
}

export function help_github() {
	openURL('https://github.com/fannithm/editor');
}

export function help_discord() {
	openURL('https://discord.gg/fDTtRJCyBP');
}
