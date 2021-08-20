<template>
	<q-form @submit="create">
		<q-select label="Map type" v-model="form.type" :options="typeOptions" emit-value map-options hint=""
		          :rules="[
		              val => !!val || 'Map type is required.'
		          ]"/>
		<q-select label="Difficulty" :model-value="form.difficulty" use-input hide-selected fill-input
		          :options="diffOptions" @input-value="val => form.difficulty = val"
		          :rules="[
		              val => /^[a-zA-Z0-9 +:@*#&]+$/g.test(val) || 'Difficulty can only contains letters, numbers and some special symbols.'
		          ]"/>
		<q-select label="Color" v-model="form.color"
		          :options="colorOptions" map-options emit-value
		          :rules="[
		              val => !!val || 'Color is required.'
		          ]">
			<template v-slot:option="scope">
				<q-item v-bind="scope.itemProps">
					<q-item-section avatar>
						<q-icon name="mdi-square" :class="`text-diff-${scope.opt.value}`"/>
					</q-item-section>
					<q-item-section>
						<q-item-label>
							{{ scope.opt.label }}
						</q-item-label>
					</q-item-section>
				</q-item>
			</template>
			<template v-slot:prepend v-if="form.color">
				<q-icon name="mdi-square" :class="`text-diff-${form.color.toLowerCase()}`"/>
			</template>
		</q-select>
		<q-input label="Level" v-model="form.level" type="number"
		         hint="Type 0 if you don't exactly know the level."
		         :rules="[
		              val => /^\d+$/g.test(val) || 'Level can only be a number.',
		              val => val >= 0 && val <= 35 || 'Level must greater than 0 and less than 35'
		         ]"/>
		<q-input label="Background music" :model-value="formMusicName" readonly tabindex="-1"
		         :rules="[
		             val => !!val || 'Background music is required.'
		         ]">
			<template v-slot:append>
				<q-btn round dense flat icon="mdi-plus" @click="selectResource">
					<q-tooltip :delay="500">
						Select resource
					</q-tooltip>
				</q-btn>
			</template>
		</q-input>
		<div class="q-mt-md row">
			<q-space/>
			<q-btn color="primary" label="Create" type="submit"/>
		</div>
	</q-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { DiffColor, MapType, MapTypeInfo, ResourceType } from '@fannithm/const';
import { useQuasar } from 'quasar';
import ResourceSelectDialog from 'components/Dialog/ResourceSelectDialog.vue';
import { OtherResource } from 'src/lib/project';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import projectState, { updateSaved } from 'src/store/project';
import { closeNewMapWindow } from 'src/lib/windowManager';

export default defineComponent({
	name: 'NewMapWindow',
	setup () {
		const typeOptions = reactive(Object.keys(MapTypeInfo).map(v => ({
			label: MapTypeInfo[v as unknown as MapType].name,
			value: v,
			disable: v !== '0' // TODO enable bang dream
		})));
		const colorOptions = reactive([
			{
				label: 'Green',
				value: DiffColor.GREEN
			},
			{
				label: 'Blue',
				value: DiffColor.BLUE
			},
			{
				label: 'Yellow',
				value: DiffColor.YELLOW
			},
			{
				label: 'Red',
				value: DiffColor.RED
			},
			{
				label: 'Purple',
				value: DiffColor.PURPLE
			},
			{
				label: 'Pink',
				value: DiffColor.PINK
			}
		]);
		const diffOptions = reactive(['Easy', 'Normal', 'Hard', 'Expert', 'Master', 'Special']);
		const levelOptions = reactive(new Array(35).fill(0).map((v, i) => (i + 1).toString()));
		const form = reactive<{
			type: string,
			difficulty: string,
			color: string,
			level: string,
			music: OtherResource | null
		}>({
			type: '',
			difficulty: '',
			color: '',
			level: '',
			music: null
		});
		const metaManager = projectState.current as ProjectMetaManager;

		const $q = useQuasar();

		function selectResource () {
			$q.dialog({
				component: ResourceSelectDialog,
				componentProps: {
					types: [ResourceType.Audio]
				}
			}).onOk((resource: OtherResource) => {
				form.music = resource;
			});
		}

		return {
			form,
			formMusicName: computed(() => form.music?.name),
			typeOptions,
			diffOptions,
			colorOptions,
			levelOptions,
			selectResource,
			async create () {
				updateSaved(false);
				await metaManager.addMap({
					bg: '',
					color: form.color as unknown as DiffColor,
					difficulty: form.difficulty,
					level: parseInt(form.level),
					mapType: form.type as unknown as MapType,
					music: form.music?.id as string
				});
				closeNewMapWindow();
			}
		};
	}
});
</script>

<style scoped>

</style>
