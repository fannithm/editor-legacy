<template>
	<div>
		<basic-window title="New Project" :show="newProjectWindow" @close="closeNewProjectWindow">
			<new-project-window/>
		</basic-window>
		<basic-window title="Open Project" :show="openProjectWindow" @close="closeOpenProjectWindow">
			<open-project-window/>
		</basic-window>
		<basic-window title="New Map" :show="newMapWindow" @close="closeNewMapWindow">
			<new-map-window/>
		</basic-window>
		<basic-window title="Resource Manager" :show="resourceManagerWindow" @close="closeResourceManagerWindow">
			<resource-manager-window/>
		</basic-window>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import BasicWindow from 'components/Window/BasicWindow.vue';
import NewProjectWindow from 'components/Window/NewProjectWindow.vue';
import OpenProjectWindow from 'components/Window/OpenProjectWindow.vue';
import uiState from 'src/store/ui';
import {
	closeNewMapWindow,
	closeNewProjectWindow,
	closeOpenProjectWindow,
	closeResourceManagerWindow
} from 'src/lib/windowManager';
import NewMapWindow from 'components/Window/NewMapWindow.vue';
import ResourceManagerWindow from 'components/Window/ResourceManagerWindow.vue';

export default defineComponent({
	name: 'WindowContainer',
	components: { ResourceManagerWindow, NewMapWindow, BasicWindow, NewProjectWindow, OpenProjectWindow },
	setup () {
		return {
			closeNewProjectWindow,
			closeOpenProjectWindow,
			closeNewMapWindow,
			closeResourceManagerWindow,
			newProjectWindow: computed(() => uiState.window.newProject),
			openProjectWindow: computed(() => uiState.window.openProject),
			newMapWindow: computed(() => uiState.window.newMap),
			resourceManagerWindow: computed(() => uiState.window.resourceManager)
		};
	}
});
</script>

<style scoped>

</style>
