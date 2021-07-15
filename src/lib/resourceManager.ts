import { ResourceType } from 'src/lib/const';
import { db } from 'src/lib/db';

export function createResource (name: string, projectId: number, type: ResourceType, blob: Blob) {
	return db.resources.add({
		name,
		projectId,
		type,
		blob,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime()
	});
}

export function getMetaResource (projectId: number) {
	return db.resources.get({
		projectId,
		type: ResourceType.META
	});
}
