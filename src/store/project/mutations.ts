import { MutationTree } from 'vuex';
import { ProjectStateInterface } from './state';
import { IProject } from 'src/lib/db';
import ProjectManager from 'src/lib/projectManager';

const mutation: MutationTree<ProjectStateInterface> = {
	updateRecentProject (state: ProjectStateInterface, payload: IProject[]) {
		state.recent = payload;
	},

	openProject (state: ProjectStateInterface, project: ProjectManager) {
		state.current = project;
	}
};

export default mutation;
