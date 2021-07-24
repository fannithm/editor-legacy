<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
		<q-card class="q-dialog-plugin">
			<q-card-section>
				<div class="text-h6">Select Resource</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				Please select your map background music.
			</q-card-section>

			<q-card-section class="q-pt-none">
				<q-tabs v-model="tab" no-caps class="text-primary" v-if="types.length > 1">
					<q-tab :name="type" :label="resourceTypeName[type].toUpperCase()" :key="type"
					       v-for="type in types"/>
				</q-tabs>
			</q-card-section>

			<q-card-actions align="right">
				<q-btn color="primary" flat label="Ok" @click="onOKClick" autofocus/>
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
import { store } from 'src/store';
import projectState from 'src/state/project';

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
		const tab = ref<ResourceType>(props.types[0] as ResourceType);
		return {
			tab,
			resources: computed(() => (projectState.current  as ProjectMetaManager).resources[tab.value]),

			resourceTypeName: ResourceTypeName,
			dialogRef,
			onDialogHide,

			onOKClick () {
				onDialogOK();
			},
			onCancelClick: onDialogCancel
		};
	}
});
</script>
