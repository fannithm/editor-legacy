import { MutationTree } from 'vuex';
import { UIStateInterface } from './state';

const mutation: MutationTree<UIStateInterface> = {
	openNewWindow (state: UIStateInterface) {
		state.window.new = true;
	},
	closeNewWindow (state: UIStateInterface) {
		state.window.new = false;
	}
};

export default mutation;
