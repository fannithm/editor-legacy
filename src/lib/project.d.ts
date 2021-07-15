import { MapBackgroundType, MapType, ResourceType, UUIDType } from 'src/lib/const';

type UUID = string;

export interface ProjectMeta {
	name: string;
	songName: string;
	songNameRomanized: string;
	artist: string;
	artistRomanized: string;
	uuids: {
		[key: string]: UUIDType
	};
	resources: {
		map: MapResource[];
		audio: OtherResource[];
		image: OtherResource[];
		video: OtherResource[];
		script: OtherResource[]
	}
}


export interface MapResource {
	id: UUID;
	type: ResourceType.MAP
	name: string;
	mapType: MapType;
	difficulty: string;
	level: number;
	musicId: UUID;
	bgType: MapBackgroundType;
	bgId: UUID;
	scripts: UUID[]
}

export interface OtherResource {
	id: UUID;
	name: string;
	type: ResourceType.AUDIO | ResourceType.IMAGE | ResourceType.VIDEO | ResourceType.SCRIPT;
}

