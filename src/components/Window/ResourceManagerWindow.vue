<template>
	<div>
		<q-tabs v-model="tab" no-caps class="text-primary" v-if="types.length > 1">
			<q-tab :name="type" :label="resourceTypeName[type].toUpperCase()" :key="type"
			       v-for="type in types"/>
		</q-tabs>
		<q-list separator class="non-selectable">
			<template v-if="resourceList instanceof Array">
				<div class="text-center q-py-md" v-if="resourceList.length === 0">
					No resource
				</div>
				<q-item v-for="resource in resourceList" :key="resource.id">
					<q-item-section>
						<q-item-label>
							meta.json
						</q-item-label>
						<q-item-label caption>
							<div>Created: 1</div>
							<div>Last Updated: 1</div>
						</q-item-label>
					</q-item-section>
					<q-item-section side>
						<div>
							<q-btn class="q-ml-sm" icon="mdi-code-json" flat round size="12px">
								<q-tooltip :delay="500">View Code</q-tooltip>
							</q-btn>
							<q-btn class="q-ml-sm" icon="mdi-image-search" flat round size="12px">
								<q-tooltip :delay="500">View Image</q-tooltip>
							</q-btn>
							<q-btn class="q-ml-sm" icon="mdi-play-circle" flat round size="12px">
								<q-tooltip :delay="500">Play Music</q-tooltip>
							</q-btn>
							<q-btn class="q-ml-sm" icon="mdi-rename-box" flat round size="12px">
								<q-tooltip :delay="500">Rename</q-tooltip>
							</q-btn>
							<q-btn class="q-ml-sm" icon="mdi-delete" flat round size="12px">
								<q-tooltip :delay="500">Delete</q-tooltip>
							</q-btn>
						</div>
					</q-item-section>
				</q-item>
			</template>
			<q-item v-else>
				<q-item-section>
					<q-item-label>
						{{ resourceList.name }}
					</q-item-label>
				</q-item-section>
				<q-item-section side>
					<div>
						<q-btn class="q-ml-sm" icon="mdi-code-json" flat round size="12px" disable>
							<q-tooltip :delay="500">View Code</q-tooltip>
						</q-btn>
					</div>
				</q-item-section>
			</q-item>
		</q-list>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { ResourceType, ResourceTypeName } from 'src/lib/const';
import { store } from 'src/store';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';

export default defineComponent({
	name: 'ResourceManagerWindow',
	setup () {
		const tab = ref<ResourceType>(ResourceType.META);
		const metaManager = store.state.project.current as ProjectMetaManager;
		return {
			tab,
			types: [
				ResourceType.META,
				ResourceType.MAP,
				ResourceType.AUDIO,
				ResourceType.IMAGE,
				ResourceType.VIDEO,
				// TODO ResourceType.SCRIPT,
				ResourceType.OTHER
			],
			resourceTypeName: ResourceTypeName,
			resourceList: computed(() => metaManager.resources[tab.value])
		};
	}
});
</script>

<style scoped>

</style>
