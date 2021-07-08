import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ProjectStateInterface } from './state';
import { getRecentProjects } from 'src/lib/projectManager';

const actions: ActionTree<ProjectStateInterface, StateInterface> = {
	async updateRecentProject (context) {
		const recent = await getRecentProjects();
		context.commit('updateRecentProject', recent);
	}
};

export default actions;
