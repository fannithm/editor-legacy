<template>
	<div class="full-width full-height row justify-center items-center">
		<div v-if="!map">
			<p class="text-center text-h6">
				Start With...
			</p>
			<q-list bordered separator style="min-width: 280px;">
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
				<q-item clickable v-ripple v-for="map in maps" :key="map.id" @click="openMapFile(map)">
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
		<page-map v-else/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import projectState from 'src/store/project';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { ResourceType } from '@fannithm/const';
import PageMap from 'pages/Map.vue';
import mapState, { openMap } from 'src/store/map';
import { getBlobById } from 'src/lib/db/resources';
import { useQuasar } from 'quasar';
import { MapResource } from 'src/lib/project';
import { execCommand } from 'src/lib/execCommand';

export default defineComponent({
	name: 'PageProject',
	components: { PageMap },
	setup() {
		const $q = useQuasar();

		const project = computed(() => projectState.current as ProjectMetaManager);
		const maps = computed(() => project.value.resources[ResourceType.Map]);

		const onBeforeUnload = () => {
			return projectState.saved ? null : '';
		};

		onMounted(() => {
			window.onbeforeunload = onBeforeUnload;
		});

		const map = computed(() => mapState.map);

		return {
			map,
			project,
			maps,
			newMap: execCommand('file/newMapWindow'),
			resourceManager: execCommand('file/resourceManagerWindow'),
			async openMapFile(map: MapResource) {
				const mapData = await getBlobById(map.id);
				if (mapData === undefined) {
					$q.dialog({
						message: `Cannot find map file ${ map.id }`
					});
					return;
				}
				openMap(map.id, JSON.parse(await mapData.blob.text()), map, map.name);
			}
		};
	}
});
</script>

<style scoped>

</style>
