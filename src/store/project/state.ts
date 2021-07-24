import { IProject } from 'src/lib/db/db';

export interface ProjectStateInterface {
	recent: IProject[]
}

function state (): ProjectStateInterface {
	return {
		recent: []
	};
}

export default state;
