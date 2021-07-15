<template>
	<q-form @submit="create">
		<q-input v-model="form.name" label="Project name"
		         :rules="[val => !!val || 'Project name is required.']"
		         hint="Can be modified anytime after creating."/>
		<q-input v-model="form.songName" label="Song name"
		         :rules="[
		             val => !!val || 'Song name is required.',
		             val => val.length < 128 || 'Song name should less than 128 characters.'
	             ]"
		         hint=""/>
		<q-input v-model="form.songNameRomanized" label="Romanized song name"
		         :rules="[
		             val => !!val || 'Romanized song name is required.',
		             val => val.length < 128 || 'Romanized song name should less than 128 characters.',
		             val => /^[a-zA-z0-9 ]+$/g.test(val) || 'Romanized song name can only contain letters and numbers.'
	             ]"
		         hint=""/>
		<q-input v-model="form.artist" label="Artist name"
		         :rules="[
		             val => !!val || 'Artist name is required.',
		             val => val.length < 128 || 'Artist name should less than 128 characters.'
	             ]"
		         hint=""/>
		<q-input v-model="form.artistRomanized" label="Romanized artist name"
		         :rules="[
		             val => !!val || 'Romanized artist name is required.',
		             val => val.length < 128 || 'Romanized artist name should less than 128 characters.',
		             val => /^[a-zA-z0-9 ]+$/g.test(val) || 'Romanized artist name can only contain letters and numbers.'
	             ]"
		         hint=""/>
		<div class="q-mt-md text-negative" v-if="errorMessage">
			<q-icon name="mdi-close"/>
			{{ errorMessage }}
		</div>
		<div class="q-mt-md row">
			<q-space></q-space>
			<q-btn color="primary" label="Create" type="submit"/>
		</div>
	</q-form>
	<!--		<q-list class="col-4 non-selectable" dense separator>
				<q-item clickable v-ripple="!item.disable" :disable="item.disable" :active="type === index"
						:key="index" v-for="(item, index) in typeList">
					<q-item-section>{{ item.name }}</q-item-section>
					<q-item-section side v-if="item.icon">
						<q-icon :name="item.icon" color="red"/>
					</q-item-section>
				</q-item>
			</q-list>-->
	<!--		<q-tab-panels v-model="tab" animated class="bg-transparent">
				<q-tab-panel name="intro">
					<p class="q-mb-none">
						{{ $t(`window.new.projects.${ type }.desc`) }}
					</p>
					<q-list dense>
						<q-item :key="index"
								v-for="(item, index) in $i18n.messages[$i18n.locale].window.new.projects[type].features">
							<q-item-section>
								<div>
									<q-icon name="mdi-check"/>
									{{ item }}
								</div>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<div>
									...
								</div>
							</q-item-section>
						</q-item>
					</q-list>
					<div class="q-mt-md row">
						<q-space></q-space>
						<q-btn color="primary" label="Next" @click="tab = 'create'"/>
					</div>
				</q-tab-panel>

				<q-tab-panel name="create">
				</q-tab-panel>
			</q-tab-panels>-->
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import ProjectManager, { createProject, hasProjectName } from 'src/lib/projectManager';
import { useQuasar } from 'quasar';
import { closeNewWindow } from 'src/lib/windowManager';
import { store } from 'src/store';
import { createResource } from 'src/lib/resourceManager';
import { ResourceType } from 'src/lib/const';

/*declare type MapTypeList = {
 name: string,
 icon: string,
 disable?: boolean
 }[];
 const typeList = [
 {
 name: 'Project Sekai',
 icon: 'mdi-new-box'
 },
 {
 name: 'BanG Dream',
 disable: true
 }
 ] as MapTypeList;*/

export default defineComponent({
	name: 'NewWindow',
	setup () {
		const $q = useQuasar();
		const needCheck = ref(false);

		const form = reactive({
			name: '',
			songName: '',
			songNameRomanized: '',
			artist: '',
			artistRomanized: ''
		});

		const errorMessage = computed(() => {
			// TODO project name exist error
			if (!needCheck.value) return '';
			if (form.name === '')
				return 'Project name cannot be empty.';
			return '';
		});

		async function checkName () {
			const has = await hasProjectName(form.name);
			// TODO check
		}


		const create = async () => {
			needCheck.value = true;
			await checkName();
			if (errorMessage.value) return;
			try {
				const id = await createProject(form.name);
				closeNewWindow();
				const project = new ProjectManager({
					name: form.name,
					songName: form.songName,
					songNameRomanized: form.songNameRomanized,
					artist: form.artist,
					artistRomanized: form.artistRomanized
				});
				await createResource('meta.json', id, ResourceType.META, new Blob([
					JSON.stringify(project.toJSON())
				], { type: 'application/json' }));
				store.commit('project/openProject', project);
			} catch (e) {
				$q.dialog({
					title: 'Created Failed',
					message: 'For more information, please check the error message in console and contact the developer.',
					persistent: true
				});
				console.error(e);
			}
		};

		return {
			needCheck,
			form,
			create,
			errorMessage
		};
	}
});
</script>

<style scoped>

</style>
