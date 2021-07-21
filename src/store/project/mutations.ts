import { MutationTree } from 'vuex';
import { ProjectStateInterface } from './state';
import { IProject } from 'src/lib/db/db';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';

const mutation: MutationTree<ProjectStateInterface> = {
	updateRecentProject (state: ProjectStateInterface, payload: IProject[]) {
		state.recent = payload;
	},

	openProject (state: ProjectStateInterface, project: ProjectMetaManager) {
		state.current = project;
	},

	closeProject (state: ProjectStateInterface) {
		state.current = null;
	},

	updateSaved (state: ProjectStateInterface, payload: boolean) {
		state.saved = payload;
	}
};

export default mutation;
