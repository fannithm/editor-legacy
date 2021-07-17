<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss>
		<q-card class="q-dialog-plugin">
			<q-card-section>
				Save changes before closing the project?
			</q-card-section>

			<q-card-actions align="right">
				<q-btn color="primary" flat label="Yes" @click="onOKClick" autofocus/>
				<q-btn color="primary" flat label="No" @click="onCancelClick"/>
				<q-btn color="primary" flat label="Cancel" v-close-popup/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

export default {
	name: 'SaveDialog',
	emits: [
		...useDialogPluginComponent.emits
	],
	setup () {
		const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

		const input = ref('');

		return {
			dialogRef,
			onDialogHide,

			input,

			onOKClick () {
				onDialogOK();
			},

			onCancelClick: onDialogCancel
		};
	}
};
</script>
