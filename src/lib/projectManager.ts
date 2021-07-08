import { db } from 'src/lib/db';
import { ProjectType } from 'src/lib/const';

export function getAllProjects () {
	return db.projects.toArray();
}

export function getRecentProjects (num = 5) {
	return db.projects.limit(num).reverse().sortBy('updatedAt');
}

export function createProject () {
	return db.projects.add({
		name: '114514',
		version: 1,
		type: ProjectType.PJSK,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime()
	});
}
