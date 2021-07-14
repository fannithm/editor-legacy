export const VERSION = process.env.VERSION;
export const COMMIT = process.env.COMMIT;
export const BUILT_TIME = parseInt(process.env.BUILT_TIME as string) * 1000;

export const enum ProjectType {
	PJSK = 0,
	BANG = 1,
	// PGRS = 2
}

export const enum ResourceType {
	META = 0,
	MAP = 1,
	MUSIC = 2,
	IMAGE = 3,
	VIDEO = 4,
	SCRIPT = 5
}

export const ProjectTypeInfo = {
	[ProjectType.PJSK]: {
		name: 'Project Sekai',
		version: 1
	},
	[ProjectType.BANG]: {
		name: 'BanG Dream',
		version: 1
	}
};
