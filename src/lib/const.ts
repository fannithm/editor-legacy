export const VERSION = process.env.VERSION;
export const COMMIT = process.env.COMMIT;
export const BUILT_TIME = parseInt(process.env.BUILT_TIME as string) * 1000;

export const enum ProjectType {
	PJSK = 0
}

export const enum ResourceType {
	MAP = 0,
	MUSIC = 1,
}
