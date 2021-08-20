import Dexie from 'dexie';
import { ResourceType, UUID } from '@fannithm/const';


export class FnmEditorDb extends Dexie {
	projects: Dexie.Table<IProject, number>;
	resources: Dexie.Table<IResource, number>;

	constructor () {
		super('FnmEditorDb');

		//
		// Define tables and indexes
		// (Here's where the implicit table props are dynamically created)
		//
		this.version(1).stores({
			projects: '++id, &name, createdAt, updatedAt',
			resources: '++id, name, projectId, [projectId+type]'
		});

		// The following lines are needed for it to work across typescipt using babel-preset-typescript:
		this.projects = this.table('projects');
		this.resources = this.table('resources');
	}
}


export interface IProject {
	id?: number;
	name: string;
	createdAt: number,
	updatedAt: number
}


export interface IResource {
	id: UUID;
	name: string;
	projectId: number;
	type: ResourceType;
	blob: Blob;
	createdAt: number;
	updatedAt: number;
}

export const db = new FnmEditorDb();
