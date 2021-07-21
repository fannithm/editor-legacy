<template>
	<div>
		<!-- filter area -->
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
	</div>
</template>

<script lang="ts">

import { computed, onMounted, ref } from 'vue';
import { getAllProjects } from 'src/lib/db/projects';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IProject } from 'src/lib/db/db';
import RecursiveMenu from 'components/RecursiveMenu.vue';
import { file_deleteProject, file_openProject } from 'src/lib/commands';
import { closeOpenProjectWindow } from 'src/lib/windowManager';

dayjs.extend(relativeTime);

export default {
	name: 'OpenProjectWindow',
	components: { RecursiveMenu },
	setup: function () {
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


		async function openProject (index: number) {
			if (filteredProjects.value === null) return;
			const project = filteredProjects.value[index];
			await file_openProject(project.id as number);
			closeOpenProjectWindow();
		}

		return {
			projects,
			filteredProjects,
			search,
			openProject,
			contextMenu: [
				{
					name: 'Open Project',
					async click () {
						await openProject(menuIndex.value);
					}
				},
				{
					name: 'Delete Project',
					async click () {
						await file_deleteProject(projects.value?.[menuIndex.value].id as number);
						projects.value = await getAllProjects();
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
