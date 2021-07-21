import { DiffColor, MapType, ResourceType } from 'src/lib/const';

type UUID = string;

export interface ProjectMeta {
	name: string;
	songName: string;
	songNameRomanized: string;
	artist: string;
	artistRomanized: string;
	uuids: {
		[key: string]: ResourceType
	};
	resources: {
		[ResourceType.OTHER]: OtherResource[];
		[ResourceType.META]: OtherResource;
		[ResourceType.MAP]: MapResource[];
		[ResourceType.AUDIO]: OtherResource[];
		[ResourceType.IMAGE]: OtherResource[];
		[ResourceType.VIDEO]: OtherResource[];
		[ResourceType.SCRIPT]: OtherResource[]
	}
}

export type Resource = MapResource | OtherResource;

interface R {
	id: UUID;
	name: string;
	type: ResourceType;
}


export interface MapResource extends R {
	type: ResourceType.MAP;
	mapType: MapType;
	color: DiffColor;
	difficulty: string;
	level: number;
	music: UUID;
	bg: UUID;
	offset: number;
	scripts: UUID[];
}

export interface OtherResource extends R {
	type: ResourceType.META | ResourceType.AUDIO | ResourceType.IMAGE | ResourceType.VIDEO | ResourceType.SCRIPT;
}

