import { IProject } from 'src/lib/db';
import ProjectManager from 'src/lib/projectManager';

export interface ProjectStateInterface {
	recent: IProject[],
	current: ProjectManager | null
}

function state (): ProjectStateInterface {
	return {
		recent: [],
		current: null
	};
}

export default state;
