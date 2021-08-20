import { DiffColor, MapType, ResourceType, UUID } from '@fannithm/const';

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
		[ResourceType.Other]: OtherResource[];
		[ResourceType.Meta]: OtherResource;
		[ResourceType.Map]: MapResource[];
		[ResourceType.Audio]: OtherResource[];
		[ResourceType.Image]: OtherResource[];
		[ResourceType.Video]: OtherResource[];
		[ResourceType.Script]: OtherResource[]
	}
}

export type Resource = MapResource | OtherResource;

interface R {
	id: UUID;
	name: string;
	type: ResourceType;
}

export interface MapResource extends R {
	type: ResourceType.Map;
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
	type: ResourceType.Meta | ResourceType.Audio | ResourceType.Image | ResourceType.Video | ResourceType.Script;
}

