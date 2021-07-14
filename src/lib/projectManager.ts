import { db } from 'src/lib/db';
import { ProjectType } from 'src/lib/const';

export function getAllProjects () {
	return db.projects.reverse().sortBy('updatedAt');
}

export function getRecentProjects (num = 5) {
	return db.projects.limit(num).reverse().sortBy('updatedAt');
}

export function hasProjectName (name: string) {
	return db.projects.where({ name }).count().then(data => data > 0);
}

export function createProject (name: string, type: ProjectType, version: number) {
	return db.projects.add({
		name,
		version,
		type,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime()
	});
}

export function deleteProjectById (id: number) {
	return db.projects.delete(id);
}
