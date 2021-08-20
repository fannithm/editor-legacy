import uiState from 'src/store/ui';

export function openNewProjectWindow () {
	uiState.window.newProject = true;
}

export function closeNewProjectWindow () {
	uiState.window.newProject = false;
}

export function openOpenProjectWindow () {
	uiState.window.openProject = true;
}

export function closeOpenProjectWindow () {
	uiState.window.openProject = false;
}


export function openNewMapWindow () {
	uiState.window.newMap = true;
}

export function closeNewMapWindow () {
	uiState.window.newMap = false;
}

export function openResourceManagerWindow () {
	uiState.window.resourceManager = true;
}

export function closeResourceManagerWindow () {
	uiState.window.resourceManager = false;
}
