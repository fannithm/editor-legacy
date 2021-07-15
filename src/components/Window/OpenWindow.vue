<template>
	<div>
		<!-- filter area TODO mobile -->
		<div class="row q-mb-md">
			<q-input v-model="search" placeholder="Search project" dense class="full-width" debounce="500">
				<template v-slot:prepend>
					<q-icon name="mdi-magnify"/>
				</template>
			</q-input>
		</div>

		<!-- list area -->
		<q-list class="non-selectable" separator>
			<!-- context menu -->
			<q-menu touch-position context-menu @before-show="show">
				<recursive-menu :menu="contextMenu"/>
			</q-menu>
			<!-- empty text-->
			<div class="text-center q-mb-md" v-if="!filteredProjects?.length">No project founded.</div>
			<!-- list item -->
			<q-item clickable v-ripple v-for="(item, index) in filteredProjects" :key="index"
			        :data-context-menu-index="index" @click="openProject(index)">
				<q-item-section>
					<q-item-label>
						{{ item.name }}
					</q-item-label>
					<q-item-label caption>
						<div>Created: {{ fromNow(item.createdAt) }}</div>
						<div>Last Updated: {{ fromNow(item.updatedAt) }}</div>
					</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>

		<!-- delete confirm dialog -->
		<q-dialog v-model="deletePrompt" persistent>
			<q-card>
				<q-card-section>
					<div class="text-h6">Are you absolutely sure?</div>
				</q-card-section>

				<q-card-section class="q-pt-none">
					This action <b>cannot</b> be undone. This will permanently delete the {{ deleteProjectName }}
					project with all its resources.
					<br><br>
					Please type <b>{{ deleteProjectName }}</b> to confirm.

				</q-card-section>

				<q-card-section class="q-pt-none">
					<q-input dense v-model="inputDeleteName" autofocus @keyup.enter="deleteProject"/>
				</q-card-section>

				<q-card-actions align="between" class="text-primary">
					<q-btn flat label="Cancel" v-close-popup/>
					<q-btn flat label="Delete" class="text-negative" @click="deleteProject" v-close-popup
					       :disable="deleteProjectName !== inputDeleteName"/>
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script lang="ts">

import { computed, onMounted, ref } from 'vue';
import { deleteProjectById, getAllProjects } from 'src/lib/projectManager';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IProject } from 'src/lib/db';
import RecursiveMenu from 'components/RecursiveMenu.vue';
import { useQuasar } from 'quasar';
import { file_open } from 'src/lib/commands';
import { closeOpenWindow } from 'src/lib/windowManager';

dayjs.extend(relativeTime);

export default {
	name: 'OpenWindow',
	components: { RecursiveMenu },
	setup () {
		const $q = useQuasar();

		const projects = ref<Array<IProject> | null>(null);
		const menuIndex = ref<number>(-1);
		onMounted(async () => {
			projects.value = await getAllProjects();
		});

		const search = ref('');
		const filteredProjects = computed<Array<IProject> | null>(() => {
			if (projects.value === null) return null;
			let filtered = [...projects.value];
			if (search.value) {
				filtered = filtered.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()));
			}
			return filtered;
		});

		const deletePrompt = ref(false);
		const deleteProjectName = ref('');
		const inputDeleteName = ref('');

		async function deleteProject () {
			if (deleteProjectName.value !== inputDeleteName.value) return;
			const id = projects.value?.[menuIndex.value].id as number;
			try {
				await deleteProjectById(id);
				projects.value = await getAllProjects();
				inputDeleteName.value = '';
				deletePrompt.value = false;
			} catch (e) {
				$q.dialog({
					title: 'Failed',
					message: 'For more information, please check the error message in console and contact the developer.',
					persistent: true
				});
				console.error(e);
			}
		}

		async function openProject (index: number) {
			if (filteredProjects.value === null) return;
			const project = filteredProjects.value[index];
			await file_open(project.id!);
			closeOpenWindow();
		}

		return {
			filteredProjects,
			search,
			deletePrompt,
			deleteProjectName,
			inputDeleteName,
			openProject,
			deleteProject,
			contextMenu: [
				{
					name: 'Open Project',
					async click () {
						await openProject(menuIndex.value);
					}
				},
				{
					name: 'Delete Project',
					click () {
						deletePrompt.value = true;
						deleteProjectName.value = projects.value?.[menuIndex.value].name as string;
					}
				}
			],
			fromNow (time: number) {
				return dayjs(time).fromNow();
			},
			show (e: MouseEvent) {
				let ele = e.target as HTMLElement;
				while (true) {
					if (ele.dataset.contextMenuIndex) {
						menuIndex.value = parseInt(ele.dataset.contextMenuIndex);
						break;
					}
					ele = ele.parentNode as HTMLElement;
				}
			}
		};
	}
};
</script>
