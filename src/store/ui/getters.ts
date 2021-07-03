import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UIStateInterface } from './state';

const getters: GetterTree<UIStateInterface, StateInterface> = {
	someAction (/* context */) {
		// your code
	}
};

export default getters;
