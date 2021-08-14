<template>
	<div>
		<div class="row">
			<q-space/>
			<q-btn icon="mdi-upload" label="Upload" color="primary" @click="upload"/>
			<q-space/>
		</div>
		<q-tabs v-model="tab" no-caps class="text-primary q-mt-md" v-if="types.length > 1">
			<q-tab :name="type" :label="resourceTypeName[type].toUpperCase()" :key="type"
			       v-for="type in types"/>
		</q-tabs>
		<q-list separator>
			<template v-if="resourceList instanceof Array">
				<div class="text-center q-py-md" v-if="resourceList.length === 0">
					No resource
				</div>
				<q-item v-for="resource in resourceList" :key="resource.id" clickable>
					<q-item-section>
						<q-item-label>{{ resource.name }}</q-item-label>
						<q-item-label caption>{{ resource.id }}</q-item-label>
					</q-item-section>
					<q-item-section side>
						<div>
							<q-btn disable class="q-ml-sm" icon="mdi-code-json" flat round size="12px">
								<q-tooltip :delay="500">View Code</q-tooltip>
							</q-btn>
							<q-btn disable class="q-ml-sm" icon="mdi-image-search" flat round size="12px">
								<q-tooltip :delay="500">View Image</q-tooltip>
							</q-btn>
							<q-btn disable class="q-ml-sm" icon="mdi-play-circle" flat round size="12px">
								<q-tooltip :delay="500">Play Music</q-tooltip>
							</q-btn>
							<q-btn disable class="q-ml-sm" icon="mdi-rename-box" flat round size="12px">
								<q-tooltip :delay="500">Rename</q-tooltip>
							</q-btn>
							<q-btn disable class="q-ml-sm" icon="mdi-delete" flat round size="12px">
								<q-tooltip :delay="500">Delete</q-tooltip>
							</q-btn>
						</div>
					</q-item-section>
				</q-item>
			</template>
			<q-item clickable v-else>
				<q-item-section>
					<q-item-section>
						<q-item-label>{{ resourceList.name }}</q-item-label>
						<q-item-label caption>{{ resourceList.id }}</q-item-label>
					</q-item-section>
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
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { fileDialog } from 'file-select-dialog';
import projectState, { updateSaved } from 'src/state/project';

export default defineComponent({
	name: 'ResourceManagerWindow',
	setup () {
		const tab = ref<ResourceType>(ResourceType.META);
		const metaManager = projectState.current as ProjectMetaManager;
		const mimeMap = {
			'image/jpeg': ResourceType.IMAGE,
			'image/png': ResourceType.IMAGE,
			'audio/mpeg': ResourceType.AUDIO,
			'video/mp4': ResourceType.VIDEO
		};
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
			resourceList: computed(() => metaManager.resources[tab.value]),
			async upload () {
				const file = await fileDialog({
					strict: true,
					accept: [
						'.jpg',
						'.png',
						'.mp3',
						'.mp4'
					]
				});
				if (!Object.keys(mimeMap).includes(file.type)) return;
				const type = mimeMap[file.type as keyof typeof mimeMap] as
					ResourceType.IMAGE | ResourceType.AUDIO | ResourceType.VIDEO;
				await metaManager.addResource({
					type,
					blob: new Blob([file], { type: file.type }),
					name: file.name
				});
				updateSaved(false);
				tab.value = type;
			}
		};
	}
});
</script>

<style scoped>

</style>
