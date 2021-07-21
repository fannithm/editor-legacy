<template>
	<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
		<q-card class="q-dialog-plugin">
			<q-card-section>
				<div class="text-h6">Are you absolutely sure?</div>
			</q-card-section>

			<q-card-section class="q-pt-none q-px-none">
				<q-banner class="bg-negative text-white">
					<template v-slot:avatar>
						<q-icon name="mdi-alert-circle" color="white" size="md"/>
					</template>
					This action <b>CANNOT</b> be undone. I hope you <b>MUST</b> understand what you are doing.
				</q-banner>
			</q-card-section>
			<q-card-section class="q-pt-none">
				{{ text }}
			</q-card-section>
			<q-card-section class="q-pt-none">
				Please type <b>{{ display }}</b> to confirm.
			</q-card-section>

			<q-card-section class="q-pt-none">
				<q-input dense v-model="input" autofocus @keyup.enter="onOKClick"/>
			</q-card-section>

			<q-card-actions align="between">
				<q-btn color="primary" flat label="Cancel" @click="onCancelClick"/>
				<q-btn color="primary" flat text-color="negative" label="OK" @click="onOKClick"
				       :disabled="value !== input"/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

export default {
	name: 'ConfirmDialog',
	props: {
		text: {
			required: true,
			type: String
		},
		display: {
			required: true,
			type: String
		},
		value: {
			required: true,
			type: String
		}
	},

	emits: [
		...useDialogPluginComponent.emits
	],

	setup (props: { value: string; }) {
		const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

		const input = ref('');

		return {
			dialogRef,
			onDialogHide,

			input,

			onOKClick () {
				if (props.value !== input.value) return;
				onDialogOK();
			},

			onCancelClick: onDialogCancel
		};
	}
};
</script>
