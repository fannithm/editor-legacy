import { db } from 'src/lib/db';

export async function getAllProjects () {
	await db.projects.toArray();
}
