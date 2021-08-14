<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
		<q-card class="q-dialog-plugin">
			<q-card-section>
				<div class="text-h6">Select Resource</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				Please select your map background music.
			</q-card-section>

			<q-card-section class="q-pt-none q-pa-none">
				<q-tabs v-model="tab" no-caps class="text-primary" v-if="types.length > 1">
					<q-tab :name="type" :label="resourceTypeName[type].toUpperCase()" :key="type"
					       v-for="type in types"/>
				</q-tabs>
			</q-card-section>

			<q-list separator>
				<q-item v-for="resource in resourceList" :key="resource.id" clickable
				        :active="activeId === resource.id" active-class="text-primary"
				        @click="activeId = resource.id">
					<q-item-section>
						<q-item-label>{{ resource.name }}</q-item-label>
						<q-item-label caption>ID: {{ resource.id }}</q-item-label>
					</q-item-section>
					<q-item-section side v-if="activeId === resource.id">
						<q-icon name="mdi-check" color="primary"/>
					</q-item-section>
				</q-item>
			</q-list>

			<q-card-actions align="right">
				<q-btn color="primary" flat label="Manage" @click="openResourceManagerWindow"/>
				<q-space/>
				<q-btn color="primary" flat label="Ok" @click="onOKClick" autofocus :disable="!activeId"/>
				<q-btn color="primary" flat label="Cancel" @click="onCancelClick"/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { ResourceType, ResourceTypeName } from 'src/lib/const';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import projectState from 'src/state/project';
import { OtherResource } from 'src/lib/project';
import { openResourceManagerWindow } from 'src/lib/windowManager';

export default defineComponent({
	name: 'ResourceSelectDialog',
	emits: [
		...useDialogPluginComponent.emits
	],
	props: {
		types: {
			type: Array,
			default: () => [ResourceType.AUDIO, ResourceType.IMAGE, ResourceType.VIDEO]
		}
	},
	setup (props) {
		const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
		const tab = ref<ResourceType>(props.types[0] as ResourceType.AUDIO | ResourceType.IMAGE | ResourceType.VIDEO);

		const resources = computed(() => (projectState.current as ProjectMetaManager).resources);
		const resourceList = computed(() => resources.value[tab.value] as OtherResource[]);
		const activeId = ref('');

		return {
			tab,
			resourceList,

			resourceTypeName: ResourceTypeName,
			dialogRef,
			onDialogHide,

			activeId,

			openResourceManagerWindow,

			onOKClick () {
				// const resource = .find((v: OtherResource) => v.id === activeId.value);
				// eslint-disable-next-line
				const resource = (Object.values(resources.value) as OtherResource[]).flat().find((v: OtherResource) => v.id === activeId.value);
				onDialogOK(resource);
			},
			onCancelClick: onDialogCancel
		};
	}
});
</script>
