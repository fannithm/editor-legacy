import { store as storeWrapper } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex';

import ui from './ui';
import project from './project';
import { UIStateInterface } from './ui/state';
import { ProjectStateInterface } from './project/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
	// Define your own store structure, using submodules if needed
	// example: ExampleStateInterface;
	// Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
	ui: UIStateInterface,
	project: ProjectStateInterface
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$store: VuexStore<StateInterface>
	}
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

const store = createStore<StateInterface>({
	modules: {
		ui,
		project
	},

	// enable strict mode (adds overhead!)
	// for dev mode and --debug builds only
	strict: !!process.env.DEBUGGING
});

export default storeWrapper(function (/* { ssrContext } */) {
	return store;
});

export function useStore () {
	return vuexUseStore(storeKey);
}

export { store };
