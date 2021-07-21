import { store } from 'src/store';

export function openNewProjectWindow () {
	store.commit('ui/openNewProjectWindow');
}

export function closeNewProjectWindow () {
	store.commit('ui/closeNewProjectWindow');
}

export function openOpenProjectWindow () {
	store.commit('ui/openOpenProjectWindow');
}

export function closeOpenProjectWindow () {
	store.commit('ui/closeOpenProjectWindow');
}


export function openNewMapWindow () {
	store.commit('ui/openNewMapWindow');
}

export function closeNewMapWindow () {
	store.commit('ui/closeNewMapWindow');
}

export function openResourceManagerWindow () {
	store.commit('ui/openResourceManagerWindow');
}

export function closeResourceManagerWindow () {
	store.commit('ui/closeResourceManagerWindow');
}
