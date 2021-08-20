<template>
	<q-form @submit="create">
		<q-input v-model="form.name" label="Project name" :lazy-rules="true" autofocus
		         :rules="[
		             val => !!val || 'Project name is required.',
		             checkName
		         ]"/>
		<q-input v-model="form.songName" label="Song name"
		         :rules="[
		             val => !!val || 'Song name is required.',
		             val => val.length < 128 || 'Song name should less than 128 characters.'
	             ]"/>
		<q-input v-model="form.songNameRomanized" label="Romanized song name"
		         :rules="[
		             val => !!val || 'Romanized song name is required.',
		             val => val.length < 128 || 'Romanized song name should less than 128 characters.',
		             val => /^[a-zA-z0-9 ]+$/g.test(val) || 'Romanized song name can only contain letters and numbers.'
	             ]"/>
		<q-input v-model="form.artist" label="Artist name"
		         :rules="[
		             val => !!val || 'Artist name is required.',
		             val => val.length < 128 || 'Artist name should less than 128 characters.'
	             ]"/>
		<q-input v-model="form.artistRomanized" label="Romanized artist name"
		         :rules="[
		             val => !!val || 'Romanized artist name is required.',
		             val => val.length < 128 || 'Romanized artist name should less than 128 characters.',
		             val => /^[a-zA-z0-9 ]+$/g.test(val) || 'Romanized artist name can only contain letters and numbers.'
	             ]"/>
		<div class="q-mt-md row">
			<q-space/>
			<q-btn color="primary" label="Create" type="submit"/>
		</div>
	</q-form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { createProject, getProjectById, hasProjectName } from 'src/lib/db/projects';
import { useQuasar } from 'quasar';
import { closeNewProjectWindow } from 'src/lib/windowManager';
import { createResource } from 'src/lib/db/resources';
import { ResourceType } from '@fannithm/const';
import { file_save } from 'src/lib/commands';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { IProject } from 'src/lib/db/db';
import { openProject, updateRecentProject } from 'src/store/project';

export default defineComponent({
	name: 'NewProjectWindow',
	setup () {
		const $q = useQuasar();

		const form = reactive({
			name: '',
			songName: '',
			songNameRomanized: '',
			artist: '',
			artistRomanized: ''
		});

		const create = async () => {
			try {
				const id = await createProject(form.name);
				const project = await getProjectById(id) as IProject;
				closeNewProjectWindow();
				const metaManager = new ProjectMetaManager(project, {
					name: form.name,
					songName: form.songName,
					songNameRomanized: form.songNameRomanized,
					artist: form.artist,
					artistRomanized: form.artistRomanized
				});
				await createResource({
					id: metaManager.resources[ResourceType.Meta].id,
					name: 'meta.json',
					projectId: id,
					type: ResourceType.Meta,
					blob: new Blob([
						JSON.stringify(metaManager.toJSON())
					], { type: 'application/json' })
				});
				await updateRecentProject();
				openProject(metaManager);
				await file_save();
			} catch (e) {
				$q.dialog({
					title: 'Failed',
					message: 'For more information, please check the error message in console and contact the developer.',
					persistent: true
				});
				console.error(e);
			}
		};

		return {
			form,
			create,
			async checkName () {
				const result = await hasProjectName(form.name);
				return !result || 'Project name exists.';
			}
		};
	}
});
</script>

<style scoped>

</style>
