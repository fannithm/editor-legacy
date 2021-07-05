import { MutationTree } from 'vuex';
import { UIStateInterface } from './state';

const mutation: MutationTree<UIStateInterface> = {
	openNewWindow (state: UIStateInterface) {
		state.window.new = true;
	},
	closeNewWindow (state: UIStateInterface) {
		state.window.new = false;
	},
	openOpenWindow (state: UIStateInterface) {
		state.window.open = true;
	},
	closeOpenWindow (state: UIStateInterface) {
		state.window.open = false;
	}
};

export default mutation;
