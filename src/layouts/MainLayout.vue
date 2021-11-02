<template>
	<q-layout view="lHh Lpr lFf">
		<q-header class="bg-primary text-white">
			<q-bar>
				<q-btn dense flat icon="mdi-menu">
					<q-tooltip :delay="500">Menu</q-tooltip>
					<q-menu self="top start" anchor="bottom left">
						<recursive-menu :menu="menu"/>
					</q-menu>
				</q-btn>
				<template v-if="project">
					<q-btn dense flat icon="mdi-content-save" @click="save">
						<q-tooltip :delay="500">Save</q-tooltip>
					</q-btn>
					<q-btn dense flat icon="mdi-undo">
						<q-tooltip :delay="500">Undo</q-tooltip>
					</q-btn>
				</template>

				<q-space/>

				<q-icon name="mdi-file-music"/>
				<div>
					{{ title }}
				</div>

				<q-space/>

				<q-btn dense flat :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
				       @click="toggleFullscreen" v-if="isEnabled">
					<q-tooltip :delay="500">{{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}</q-tooltip>
				</q-btn>
				<q-btn dense flat icon="mdi-close" @click="close" v-if="project">
					<q-tooltip :delay="500">Close {{ map ? 'Map' : 'Project' }}</q-tooltip>
				</q-btn>
			</q-bar>
		</q-header>

		<q-page-container style="height: 100vh">
			<page-start v-if="!project"/>
			<page-project v-else/>
		</q-page-container>

		<window-container/>
	</q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import PageStart from 'pages/Start.vue';
import PageProject from 'pages/Project.vue';
import WindowContainer from 'components/Window/WindowContainer.vue';
import RecursiveMenu, { RecursiveMenuItem } from 'components/RecursiveMenu.vue';
import { execCommand } from 'src/lib/commands';
import screenfull from 'screenfull';
import projectState, { recentProjectMenu, updateRecentProject } from 'src/store/project';
import mapState from 'src/store/map';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';

function toggleFullscreen () {
	if (screenfull.isEnabled) {
		if (screenfull.isFullscreen) {
			screenfull.exit().catch(err => {
				console.log(err);
			});
		} else {
			screenfull.request().catch(err => {
				console.log(err);
			});
		}
	} else {
		console.log('unsupported');
	}
}


export default defineComponent({
	components: { PageProject, PageStart, RecursiveMenu, WindowContainer },
	setup: function () {
		const menu = ref<RecursiveMenuItem[]>([
			{
				name: 'File',
				menu: [
					{
						name: 'New Project...',
						click: execCommand('file/newProjectWindow')
					},
					{
						name: 'New Map...',
						click: execCommand('file/newMapWindow')
					},
					{
						separator: true
					},
					{
						name: 'Open Project...',
						click: execCommand('file/openProjectWindow')
					},
					{
						name: 'Open Recent',
						menu: recentProjectMenu as unknown as RecursiveMenuItem[]
					},
					{
						name: 'Open from Disk...',
						disabled: true
					},
					{
						separator: true
					},
					{
						name: 'Close Map',
						click: execCommand('file/closeMap')
					},
					{
						name: 'Close Project',
						click: execCommand('file/closeProject')
					},
					{
						separator: true
					},
					{
						name: 'Resource Manager...',
						click: execCommand('file/resourceManagerWindow')
					},
					{
						separator: true
					},
					{
						name: 'Save',
						click: execCommand('file/save')
					},
					{
						name: 'Save as...',
						disabled: true
					},
					{
						name: 'Save to disk...',
						disabled: true
					},
					{
						separator: true
					},
					{
						name: 'Clear data...',
						click: execCommand('file/clearData')
					}
				]
			},
			{
				name: 'Help',
				menu: [
					{
						name: 'Documentation',
						click: execCommand('help/documentation')
					},
					{
						name: 'GitHub',
						click: execCommand('help/github')
					},
					{
						separator: true
					},
					{
						name: 'Discord Server',
						click: execCommand('help/discord')
					},
					{
						separator: true
					},
					{
						name: 'Check for Update...',
						disabled: true
					},
					{
						name: 'About',
						disabled: true
					}
				]
			}
		]);

		onMounted(async () => {
			await updateRecentProject();
		});
		const isFullscreen = ref(false);
		if (screenfull.isEnabled) {
			isFullscreen.value = screenfull.isFullscreen;
			screenfull.on('change', () => {
				isFullscreen.value = (screenfull as screenfull.Screenfull).isFullscreen;
			});
		}

		const project = computed(() => projectState.current);
		const map = computed(() => mapState.map);

		return {
			menu,
			isEnabled: screenfull.isEnabled,
			isFullscreen,
			toggleFullscreen,
			close: computed(() => map.value ? execCommand('file/closeMap') : execCommand('file/closeProject')),
			save: execCommand('file/save'),
			project,
			map,
			// TODO undo
			title: computed(() => {
				const projectSaved = computed(() => projectState.saved);
				const mapSaved = computed(() => mapState.saved);
				const mapName = computed(() => mapState.name);

				return (mapName.value ? `${ mapSaved.value ? '' : '*' }${ mapName.value } - ${ (project.value as ProjectMetaManager).name } - ` :
					project.value ? `${ projectSaved.value ? '' : '*' }${ project.value.name } - ` : '') + 'Fannithm Editor';
			})
		};
	}
});
</script>
