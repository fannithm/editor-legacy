import { IProject } from 'src/lib/db/db';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';

export interface ProjectStateInterface {
	recent: IProject[],
	current: ProjectMetaManager | null,
	saved: boolean
}

function state (): ProjectStateInterface {
	return {
		recent: [],
		current: null,
		saved: false
	};
}

export default state;
