import { store } from 'src/store';

export function openNewWindow () {
	store.commit('ui/openNewWindow');
}

export function closeNewWindow () {
	store.commit('ui/closeNewWindow');
}

export function openOpenWindow () {
	store.commit('ui/openOpenWindow');
}

export function closeOpenWindow () {
	store.commit('ui/closeOpenWindow');
}
