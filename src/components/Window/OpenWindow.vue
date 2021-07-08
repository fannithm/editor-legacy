<template>
	<div>
		<div class="row q-mb-md">
			<q-select outlined v-model="typeFilter"
			          :options="typeFilterOptions" dense options-dense style="min-width: 160px;">
			</q-select>
			<q-space/>
			<q-input v-model="search" placeholder="Search project" dense style="max-width: 160px">
				<template v-slot:prepend>
					<q-icon name="mdi-magnify"/>
				</template>
			</q-input>
		</div>

		<q-list class="non-selectable" separator>
			<div class="text-center q-mb-md" v-if="!projects?.length">No project founded.</div>
			<!-- TODO 移动端优化-->
			<q-item clickable v-ripple v-for="(item, index) in projects" :key="index">
				<q-item-section>
					<q-item-label>
						{{ item.name }}
					</q-item-label>
					<q-item-label caption>
						<div>Map Type: {{ item.type }}</div>
						<div>Map Format Version: {{ item.version }}</div>
					</q-item-label>
				</q-item-section>

				<q-item-section side style="font-size: 12px;">
					<span>Created: {{ fromNow(item.createdAt) }}</span>
					<span>Last Updated: {{ fromNow(item.updatedAt) }}</span>
				</q-item-section>
			</q-item>
		</q-list>
	</div>

</template>

<script lang="ts">

import { ref, onMounted } from 'vue';
import { getAllProjects } from 'src/lib/projectManager';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IProject } from 'src/lib/db';

dayjs.extend(relativeTime);

export default {
	name: 'OpenWindow',
	setup () {
		const projects = ref<Array<IProject> | null>(null);
		onMounted(async () => {
			projects.value = await getAllProjects();
		});
		return {
			projects,
			typeFilter: ref('All type'),
			typeFilterOptions: [
				'All type', 'Project Sekai'
			],
			search: ref(''),
			fromNow (time: number): string {
				return dayjs(time).fromNow();
			}
		};
	}
};
</script>
