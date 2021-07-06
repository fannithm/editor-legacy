<template>
	<div>
		<div class="row q-mb-md">
			<q-select outlined v-model="typeFilter"
			          :options="typeFilterOptions" dense options-dense style="min-width: 160px;">
			</q-select>
			<q-space></q-space>
			<q-input v-model="search" placeholder="Search project" dense style="max-width: 160px">
				<template v-slot:prepend>
					<q-icon name="mdi-magnify" />
				</template>
			</q-input>
		</div>

		<q-list class="non-selectable" separator>
			<q-item clickable v-ripple v-for="i in 3" :key="i">
				<q-item-section>
					<q-item-label>
						test project {{ i }}
					</q-item-label>
					<q-item-label caption>
						<div>Map Type: Project Sekai</div>
						<div>Map Format Version: 1</div>
					</q-item-label>
				</q-item-section>

				<q-item-section side style="font-size: 12px;">
					<span>Created: 12 days ago</span>
					<span>Last Changed: 32 minutes ago</span>
				</q-item-section>
			</q-item>
		</q-list>
	</div>

</template>

<script lang="ts">

import { ref } from 'vue';

export default {
	setup () {
		const projectList = [];
		return {
			typeFilter: ref('All type'),
			typeFilterOptions: [
				'All type', 'Project Sekai'
			],
			search: ref('')
		};
	}
};
</script>
