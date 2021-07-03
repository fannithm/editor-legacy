import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UIStateInterface } from './state';

const actions: ActionTree<UIStateInterface, StateInterface> = {
	someAction (/* context */) {
		// your code
	}
};

export default actions;
