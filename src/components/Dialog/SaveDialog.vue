<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
		<q-card class="q-dialog-plugin">
			<q-card-section>
				<div class="text-h6">Alert</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				Save changes before closing the project?
			</q-card-section>

			<q-card-actions align="right">
				<q-btn color="primary" flat label="Yes" @click="onOKClick(true)" autofocus/>
				<q-btn color="primary" flat label="No" @click="onOKClick(false)"/>
				<q-btn color="primary" flat label="Cancel" @click="onCancelClick"/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';

export default {
	name: 'SaveDialog',
	emits: [
		...useDialogPluginComponent.emits
	],
	setup () {
		const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

		return {
			dialogRef,
			onDialogHide,

			onOKClick: onDialogOK,

			onCancelClick: onDialogCancel
		};
	}
};
</script>
