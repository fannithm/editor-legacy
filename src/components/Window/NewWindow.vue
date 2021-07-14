<template>
	<div class="row q-col-gutter-md">
		<q-list class="col-4 non-selectable" dense separator>
			<q-item clickable v-ripple="!item.disable" :disable="item.disable" :active="type === index"
			        :key="index" v-for="(item, index) in typeList">
				<q-item-section>{{ item.name }}</q-item-section>
				<q-item-section side v-if="item.icon">
					<q-icon :name="item.icon" color="red"/>
				</q-item-section>
			</q-item>
		</q-list>
		<q-tab-panels v-model="tab" animated class="bg-transparent col-8">
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
				<q-form @submit="create">
					<q-input v-model="name" label="Project name"
					         hint="Can be modified anytime after creating."/>
					<q-file v-model="file" label="Music file" accept="audio/mpeg"
					        hint="Only .mp3 file is supported."/>
					<div class="q-mt-md text-negative" v-if="errorMessage">
						<q-icon name="mdi-close"/>
						{{ errorMessage }}
					</div>
					<div class="q-mt-md row">
						<q-btn color="primary" flat label="Back" @click="tab = 'intro'"/>
						<q-space></q-space>
						<q-btn color="primary" label="Create" type="submit"/>
					</div>
				</q-form>
			</q-tab-panel>
		</q-tab-panels>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { createProject, hasProjectName } from 'src/lib/projectManager';
import { ProjectType, ProjectTypeInfo } from 'src/lib/const';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { closeNewWindow } from 'src/lib/windowManager';

declare type MapTypeList = {
	name: string,
	icon: string,
	disable?: boolean
}[];

export default defineComponent({
	name: 'NewWindow',
	setup () {
		const $q = useQuasar();
		const $i18n = useI18n();
		const typeList = [
			{
				name: 'Project Sekai',
				icon: 'mdi-new-box'
			},
			{
				name: 'BanG Dream',
				disable: true
			}
		] as MapTypeList;
		const needCheck = ref(false);
		const type = ref(0);
		const tab = ref('intro');
		const name = ref('');
		const file = ref<File | null>(null);

		const errorMessage = computed(() => {
			// TODO project name exist error
			if (!needCheck.value) return '';
			if (name.value === '')
				return 'Project name cannot be empty.';
			else if (file.value === null)
				return 'Music file cannot be empty.';
			else if (file.value?.type !== 'audio/mpeg')
				return 'Music file can only be .mp3 file.';
			return '';
		});

		async function checkName () {
			const has = await hasProjectName(name.value);
			// if (has)
		}


		const create = async () => {
			needCheck.value = true;
			await checkName();
			if (errorMessage.value) return;
			try {
				const id = await createProject(name.value, ProjectType.PJSK, ProjectTypeInfo[ProjectType.PJSK].version);
				closeNewWindow();
				// TODO add music
				// TODO open project
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
			typeList,
			needCheck,
			type,
			tab,
			name,
			file,
			create,
			errorMessage
		};
	}
});
</script>

<style scoped>

</style>
