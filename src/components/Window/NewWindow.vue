<template>
	<basic-window title="New Project" close="hideNewWindow">
		<div class="row q-col-gutter-md">
			<q-list class="col-4 non-selectable" dense separator>
				<q-item clickable v-ripple="!item.disable" :disable="item.disable" :active="type === index"
				        :key="index" v-for="(item, index) in typeList">
					<q-item-section>{{ item.name }}</q-item-section>
					<q-item-section side v-if="item.icon">
						<q-icon :name="item.icon" color="red"/>
					</q-item-section>
				</q-item>
			</q-list>
			<q-tab-panels v-model="tab" animated class="bg-transparent col-8">
				<q-tab-panel name="intro">
					<p class="q-mb-none">
						Create a map for Project Sekai fan-made map, features below are supported now.
					</p>
					<q-list dense>
						<q-item>
							<q-item-section>
								<div>
									<q-icon name="mdi-check"/>
									Basic map editor.
								</div>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<div>
									<q-icon name="mdi-check"/>
									12 key in total and variable key width.
								</div>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<div>
									<q-icon name="mdi-check"/>
									Tap, flick, side flick and slide note.
								</div>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<div>
									<q-icon name="mdi-check"/>
									Variable fall speed.
								</div>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<div>
									...
								</div>
							</q-item-section>
						</q-item>
					</q-list>
					<div class="q-mt-md row">
						<q-space></q-space>
						<q-btn color="primary" label="Next" @click="tab = 'create'"/>
					</div>
				</q-tab-panel>

				<q-tab-panel name="create">
					<q-input v-model="name" label="Project name"
					         hint="Can be modified anytime after creating."/>
					<div class="q-mt-md text-negative" v-if="errorMessage">
						<q-icon name="mdi-close"/>
						{{ errorMessage }}
					</div>
					<div class="q-mt-md row">
						<q-btn color="primary" flat label="Back" @click="tab = 'intro'"/>
						<q-space></q-space>
						<q-btn color="primary" label="Create" @click="create"/>
					</div>
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</basic-window>
</template>

<script>
import { ref, computed, defineComponent, onUnmounted } from 'vue';
import BasicWindow from 'components/Window/BasicWindow.vue';

export default defineComponent({
	name: 'NewWindow',
	components: { BasicWindow },
	setup () {
		const typeList = ref([
			{
				name: 'Project Sekai',
				icon: 'mdi-new-box'
			},
			{
				name: 'BanG Dream',
				disable: true
			}
		]);
		const needCheck = ref(false);
		const type = ref(0);
		const tab = ref('intro');
		const name = ref('');

		const errorMessage = computed(() => {
			// TODO project name exist error
			return (needCheck.value && name.value === '') ? 'Project Name cannot be empty.' : '';
		});
		const create = () => {
			needCheck.value = true;
			if (errorMessage.value) return;
			console.log('create');
		};

		return {
			typeList,
			needCheck,
			type,
			tab,
			name,
			create,
			errorMessage
		};
	}
});
</script>

<style scoped>

</style>
