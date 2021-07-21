import { ResourceType } from 'src/lib/const';
import { db } from 'src/lib/db/db';
import { UUID } from 'src/lib/project';

export function createResource (resource: { id: UUID, name: string, projectId: number, type: ResourceType, blob: Blob }) {
	return db.resources.add({
		id: resource.id,
		name: resource.name,
		projectId: resource.projectId,
		type: resource.type,
		blob: resource.blob,
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

export function deleteResourceByProjectId (projectId: number) {
	return db.resources.where({ projectId }).delete();
}

export function updateResourceBlobById (id: number, blob: Blob) {
	return db.resources.update(id, { blob });
}
