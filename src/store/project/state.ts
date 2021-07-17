import { IProject } from 'src/lib/db';
import ProjectManager from 'src/lib/projectManager';

export interface ProjectStateInterface {
	recent: IProject[],
	current: ProjectManager | null,
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
