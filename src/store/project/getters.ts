import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ProjectStateInterface } from './state';
import { RecursiveMenuItem } from 'components/RecursiveMenu.vue';
import { execCommand } from 'src/lib/commands';

const getters: GetterTree<ProjectStateInterface, StateInterface> = {
	recentProjectMenu (state): RecursiveMenuItem[] {
		if (state.recent.length === 0) return [{ name: 'Empty', disabled: true }];
		return state.recent.map(v => ({
			name: v.name,
			click: execCommand('file/openProject', { projectId: v.id as number })
		}));
	}
};

export default getters;
