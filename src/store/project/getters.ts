import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ProjectStateInterface } from './state';
import { RecursiveMenuItem } from 'components/RecursiveMenu.vue';

const getters: GetterTree<ProjectStateInterface, StateInterface> = {
	recentProjectMenu (state): RecursiveMenuItem[] {
		if (state.recent.length === 0) return [{ name: 'Empty', disabled: true }];
		return state.recent.map(v => ({
			name: v.name,
			click () {
				console.log(v.id);
			}
		}));
	}
};

export default getters;
