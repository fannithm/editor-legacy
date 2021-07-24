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
		         :rules="[
		              val => /^\d+$/g.test(val) || 'Level can only be a number.',
		              val => val >= 1 && val <= 35 || 'Level must greater than 1 and less than 35'
		         ]"/>
		<q-input label="Background music" :model-value="form.music?.name" readonly tabindex="-1"
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
import { defineComponent, reactive } from 'vue';
import { DiffColor, MapType, MapTypeInfo, ResourceType } from 'src/lib/const';
import { useQuasar } from 'quasar';
import ResourceSelectDialog from 'components/Dialog/ResourceSelectDialog.vue';
import { Resource } from 'src/lib/project';
import { store } from 'src/store';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import projectState from 'src/state/project';

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
		const form = reactive({
			type: '',
			difficulty: '',
			color: '',
			level: '',
			music: ''
		});
		const metaManager = projectState.current as ProjectMetaManager;

		const $q = useQuasar();

		function selectResource () {
			$q.dialog({
				component: ResourceSelectDialog,
				componentProps: {
					types: [ResourceType.AUDIO]
				}
			}).onOk((resource: Resource) => {
				console.log(resource);
			});
		}

		return {
			form,
			typeOptions,
			diffOptions,
			colorOptions,
			levelOptions,
			selectResource,
			async create () {
				store.commit('project/updateSaved', false);
				await metaManager.addMap({
					bg: '',
					color: form.color as unknown as DiffColor,
					difficulty: form.difficulty,
					level: 0,
					mapType: form.type as unknown as MapType,
					music: ''
				});
			}
		};
	}
});
</script>

<style scoped>

</style>
