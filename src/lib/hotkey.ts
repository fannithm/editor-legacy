import tinykeys from 'tinykeys';
import mapState from 'src/store/map';
import projectState from 'src/store/project';
import { execCommand } from 'src/lib/execCommand';

export const isMac = navigator.platform.indexOf('Mac') >= 0 || navigator.platform.indexOf('iP') >= 0;

export const keys: {
	[key: string]: {
		key: string[],
		scope: 'project' | 'map' | 'global' | string,
		handler?: () => void
	}
} = {
	'file/save': {
		key: ['$mod', 'S'],
		scope: 'project',
		handler: execCommand('file/save')
	},
	'file/resourceManagerWindow': {
		key: ['$mod', 'M'],
		scope: 'project',
		handler: execCommand('file/resourceManagerWindow')
	},
	'edit/delete': {
		key: ['Delete'],
		scope: 'map',
		handler: execCommand('edit/delete')
	},
	// prevent focus on browser menu
	'alt': {
		key: ['Alt'],
		scope: 'global'
	},
	'control/cursor/default': {
		key: ['Alt', '1'],
		scope: 'map',
		handler: execCommand('control/cursor/default')
	},
	'control/cursor/tap': {
		key: ['Alt', '2'],
		scope: 'map',
		handler: execCommand('control/cursor/tap')
	},
	'control/cursor/flick': {
		key: ['Alt', '3'],
		scope: 'map',
		handler: execCommand('control/cursor/flick')
	},
	'control/cursor/slide': {
		key: ['Alt', '4'],
		scope: 'map',
		handler: execCommand('control/cursor/slide')
	},
	'control/cursor/bpm': {
		key: ['Alt', 'B'],
		scope: 'map',
		handler: execCommand('control/cursor/bpm')
	},
	'control/playOrPause': {
		key: ['Space'],
		scope: 'map',
		handler: execCommand('control/playOrPause')
	},
	'control/toggleCritical': {
		key: ['C'],
		scope: 'map',
		handler: execCommand('control/toggleCritical')
	},
	'control/toggleDirection': {
		key: ['R'],
		scope: 'map',
		handler: execCommand('control/toggleDirection')
	},
	'control/toggleCurve': {
		key: ['V'],
		scope: 'map',
		handler: execCommand('control/toggleCurve')
	},
	'control/toggleVisible': {
		key: ['X'],
		scope: 'map',
		handler: execCommand('control/toggleVisible')
	},
	'control/toggleFlick': {
		key: ['F'],
		scope: 'map',
		handler: execCommand('control/toggleFlick')
	},
	'control/cancelSlide': {
		key: ['Escape'],
		scope: 'map',
		handler: execCommand('control/cancelSlide')
	},
	'konami': {
		key: ['ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight KeyB KeyA'],
		scope: 'global',
		handler: () => {
			alert('Surprise!');
		}
	}
};


function titleCase(str: string) {
	return str[0].toUpperCase() + str.substr(1).toLowerCase();
}

export function formatAsDisplay(key: string[]) {
	return key.map(v => v === '$mod' ? (isMac ? '⌘' : 'Ctrl') : titleCase((v))).join(isMac ? '' : '+');
}

export function formatAsBind(key: string[]) {
	return key.join('+');
}

let scope = '';

export function setScope(s: string) {
	scope = s;
}

export function getScope(): string {
	return scope;
}

let unbindFn: () => void;

export function bind() {
	const keyBindings = Object.fromEntries(Object.keys(keys).map(k => [formatAsBind(keys[k].key), handler(keys[k].scope, keys[k].handler)]));
	unbindFn = tinykeys(window, keyBindings);
}

export function unbind() {
	unbindFn();
}


function handler(s: string, handler?: (e: KeyboardEvent) => void) {
	return (e: KeyboardEvent) => {
		e.preventDefault();
		if (!handler) return;
		const isInMap = mapState.map !== null && s === 'map';
		const isInProject = projectState.current !== null && s === 'project';
		if (s === 'global' || isInMap || isInProject || s === scope) {
			handler(e);
		}
	};
}
