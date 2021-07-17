import { v4 as uuid } from 'uuid';
import { db } from 'src/lib/db';
import { MapResource, OtherResource, ProjectMeta, UUID } from 'src/lib/project';
import { MapBackgroundType, MapType, ResourceType, UUIDType } from 'src/lib/const';

export function getAllProjects () {
	return db.projects.reverse().sortBy('updatedAt');
}

export function getProjectById (id: number) {
	return db.projects.get(id);
}

export function getRecentProjects (num = 5) {
	return db.projects.limit(num).reverse().sortBy('updatedAt');
}

export function hasProjectName (name: string) {
	return db.projects.where({ name }).count().then(data => data > 0);
}

export function createProject (name: string) {
	return db.projects.add({
		name,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime()
	});
}

export function deleteProjectById (id: number) {
	return db.projects.delete(id);
	// TODO delete resources
}


export default class ProjectManager {
	private uuids: { [key: string]: UUIDType } = {};
	public name: string;
	public songName: string;
	public songNameRomanized: string;
	public artist: string;
	public artistRomanized: string;
	public resources: {
		map: MapResource[];
		audio: OtherResource[];
		image: OtherResource[];
		video: OtherResource[];
		script: OtherResource[]
	};

	constructor (project: {
		name: string,
		songName: string,
		songNameRomanized: string,
		artist: string,
		artistRomanized: string
	}) {
		this.name = project.name;
		this.songName = project.songName;
		this.songNameRomanized = project.songNameRomanized;
		this.artist = project.artist;
		this.artistRomanized = project.artistRomanized;
		this.resources = {
			map: [],
			audio: [],
			image: [],
			video: [],
			script: []
		};
	}

	getUUID (type: UUIDType): UUID {
		const id = uuid();
		if (this.uuids[id]) return this.getUUID(type);
		this.uuids[id] = type;
		return id;
	}

	addMap (map: {
		mapType: MapType;
		difficulty: string;
		level: number;
		musicId: UUID;
		bgType: MapBackgroundType;
		bgId: UUID;
	}): void {
		this.resources.map.push({
			id: this.getUUID(UUIDType.MAP),
			type: ResourceType.MAP,
			bgId: map.bgId,
			bgType: map.bgType,
			difficulty: map.difficulty,
			level: map.level,
			mapType: map.mapType,
			musicId: map.musicId,
			name: map.difficulty + '.json',  // TODO illegal file name filter (\/"*?"<>|)
			scripts: []
		});
	}

	toJSON (): string {
		return JSON.stringify({
			name: this.name,
			songName: this.songName,
			songNameRomanized: this.songNameRomanized,
			artist: this.artist,
			artistRomanized: this.artistRomanized,
			uuids: this.uuids,
			resources: this.resources
		} as ProjectMeta);
	}

	static parseJSON (json: string): ProjectManager {
		const data = JSON.parse(json) as ProjectMeta;
		const project = new ProjectManager({
			name: data.name,
			songName: data.songName,
			songNameRomanized: data.songNameRomanized,
			artist: data.artist,
			artistRomanized: data.artistRomanized
		});

		project.uuids = data.uuids;

		project.resources.map = data.resources.map;
		project.resources.audio = data.resources.audio;
		project.resources.image = data.resources.image;
		project.resources.video = data.resources.video;
		project.resources.script = data.resources.script;

		return project;
	}
}
