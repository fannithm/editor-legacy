import { MutationTree } from 'vuex';
import { UIStateInterface } from './state';

const mutation: MutationTree<UIStateInterface> = {
	showNewWindow (state: UIStateInterface) {
		state.window.new = true;
	},
	hideNewWindow (state: UIStateInterface) {
		state.window.new = false;
	}
};

export default mutation;
