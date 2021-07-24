import { MutationTree } from 'vuex';
import { ProjectStateInterface } from './state';
import { IProject } from 'src/lib/db/db';

const mutation: MutationTree<ProjectStateInterface> = {
	updateRecentProject (state: ProjectStateInterface, payload: IProject[]) {
		state.recent = payload;
	}
};

export default mutation;
