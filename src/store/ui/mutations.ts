import { MutationTree } from 'vuex';
import { UIStateInterface } from './state';

const mutation: MutationTree<UIStateInterface> = {
	openNewProjectWindow (state: UIStateInterface) {
		state.window.newProject = true;
	},
	closeNewProjectWindow (state: UIStateInterface) {
		state.window.newProject = false;
	},
	openOpenProjectWindow (state: UIStateInterface) {
		state.window.openProject = true;
	},
	closeOpenProjectWindow (state: UIStateInterface) {
		state.window.openProject = false;
	},
	openNewMapWindow (state: UIStateInterface) {
		state.window.newMap = true;
	},
	closeNewMapWindow (state: UIStateInterface) {
		state.window.newMap = false;
	},
	openResourceManagerWindow (state: UIStateInterface) {
		state.window.resourceManager = true;
	},
	closeResourceManagerWindow (state: UIStateInterface) {
		state.window.resourceManager = false;
	}
};

export default mutation;
