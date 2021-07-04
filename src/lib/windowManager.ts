import { store } from 'src/store';

export function openNewWindow () {
	store.commit('ui/openNewWindow');
}

export function closeNewWindow () {
	store.commit('ui/closeNewWindow');
}
