<template>
	<div class="full-width full-height row justify-center items-center">
		<div>
			<p class="text-center text-h6">
				Start With...
			</p>
			<q-list bordered separator class="non-selectable" style="min-width: 280px;">
				<q-item clickable v-ripple @click="newMap">
					<q-item-section avatar class="q-item__section--icon">
						<q-icon color="primary" name="mdi-plus"/>
					</q-item-section>
					<q-item-section>
						Create a new map...
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple @click="resourceManager">
					<q-item-section avatar class="q-item__section--icon">
						<q-icon color="primary" name="mdi-package-variant-closed"/>
					</q-item-section>
					<q-item-section>
						Resource Manager...
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple v-for="map in maps" :key="map.id">
					<q-item-section>
						<q-item-label>{{ map.name }}</q-item-label>
						<q-item-label caption>
							<q-badge :color="`diff-${map.color}`" text-color="white">
								{{ map.difficulty }} ({{ map.level }})
							</q-badge>
						</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { execCommand } from 'src/lib/commands';
import projectState from 'src/state/project';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { ResourceType } from 'src/lib/const';

export default defineComponent({
	name: 'PageProject',
	setup () {
		const project = computed(() => projectState.current as ProjectMetaManager);
		const maps = computed(() => project.value.resources[ResourceType.MAP]);

		return {
			project,
			maps,
			newMap: execCommand('file/newMapWindow'),
			resourceManager: execCommand('file/resourceManagerWindow')
		};
	}
});
</script>

<style scoped>

</style>
