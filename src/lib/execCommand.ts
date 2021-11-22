import * as commands from './commands';
import { File_OpenProject_Args } from './commands';

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

export function execCommand(command: 'edit/delete'): () => void;

export function execCommand(command: 'control/cursor/default'): () => void;
export function execCommand(command: 'control/cursor/tap'): () => void;
export function execCommand(command: 'control/cursor/flick'): () => void;
export function execCommand(command: 'control/cursor/slide'): () => void;
export function execCommand(command: 'control/cursor/bpm'): () => void;
export function execCommand(command: 'control/playOrPause'): () => void;
export function execCommand(command: 'control/stop'): () => void;
export function execCommand(command: 'control/toggleCritical'): () => void;
export function execCommand(command: 'control/toggleDirection'): () => void;
export function execCommand(command: 'control/toggleCurve'): () => void;
export function execCommand(command: 'control/toggleVisible'): () => void;
export function execCommand(command: 'control/toggleFlick'): () => void;
export function execCommand(command: 'control/cancelSlide'): () => void;

export function execCommand(command: 'help/documentation'): () => void;
export function execCommand(command: 'help/github'): () => void;
export function execCommand(command: 'help/discord'): () => void;

export function execCommand(command: string, args?: unknown) {
	const fn = (commands as unknown as Record<string, (args?: unknown) => unknown>)[command.split('/').join('_')];
	if (!fn) {
		throw new Error(`Command "${ command }" not found`);
	}
	return () => fn(args);
}
