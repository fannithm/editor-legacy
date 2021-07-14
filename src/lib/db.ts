import Dexie from 'dexie';
import { ProjectType, ResourceType } from 'src/lib/const';

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
			projects: '++id, &name, type, version, createdAt, updatedAt',
			resources: '++id, name, projectId, type'
		});

		// The following lines are needed for it to work across typescipt using babel-preset-typescript:
		this.projects = this.table('projects');
		this.resources = this.table('resources');
	}
}


export interface IProject {
	id?: number;
	name: string;
	version: number
	type: ProjectType,
	createdAt: number,
	updatedAt: number
}


export interface IResource {
	id?: number;
	name: string;
	projectId: number;
	type: ResourceType;
	blob: string
}

export const db = new FnmEditorDb();
