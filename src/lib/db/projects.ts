import { db } from 'src/lib/db/db';
import { deleteResourceByProjectId } from 'src/lib/db/resources';

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

export async function deleteProjectById (id: number) {
	await db.projects.delete(id);
	return deleteResourceByProjectId(id);
}
