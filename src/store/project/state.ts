import { IProject } from 'src/lib/db';

export interface ProjectStateInterface {
	recent: IProject[],
	current: IProject | null,
	meta: {
		name: string,
		romanizedName: string,
		artist: string,
		romanizedArtist: string,

	}
}

function state (): ProjectStateInterface {
	return {
		recent: [],
		current: null,
		meta: {
			name: '',
			romanizedName: '',
			artist: '',
			romanizedArtist: ''
		}
	};
}

export default state;
