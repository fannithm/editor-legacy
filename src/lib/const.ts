export const VERSION = process.env.VERSION;
export const COMMIT = process.env.COMMIT;
export const BUILT_TIME = parseInt(process.env.BUILT_TIME as string) * 1000;

export const enum MapType {
	PJSK = 0,
	BANG = 1,
	// PGRS = 2
}

export const enum ResourceType {
	OTHER = 0,
	META = 1,
	MAP = 2,
	AUDIO = 3,
	IMAGE = 4,
	VIDEO = 5,
	SCRIPT = 6
}

export const ResourceTypeName = {
	[ResourceType.OTHER]: 'Other',
	[ResourceType.META]: 'Meta',
	[ResourceType.MAP]: 'Map',
	[ResourceType.AUDIO]: 'Audio',
	[ResourceType.IMAGE]: 'Image',
	[ResourceType.VIDEO]: 'Video',
	[ResourceType.SCRIPT]: 'Script'
};

export enum DiffColor {
	BLUE = 'blue',
	GREEN = 'green',
	YELLOW = 'yellow',
	RED = 'red',
	PURPLE = 'purple',
	PINK = 'pink'
}

export const MapTypeInfo = {
	[MapType.PJSK]: {
		name: 'Project Sekai',
		version: 1
	},
	[MapType.BANG]: {
		name: 'BanG Dream',
		version: 1
	}
};


export enum PJSKNoteType {

}
