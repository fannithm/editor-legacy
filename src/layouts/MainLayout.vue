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
				<q-btn dense flat icon="mdi-content-save">
					<q-tooltip :delay="500">Save</q-tooltip>
				</q-btn>
				<q-btn dense flat icon="mdi-undo">
					<q-tooltip :delay="500">Undo</q-tooltip>
				</q-btn>
				<q-btn dense flat icon="mdi-redo">
					<q-tooltip :delay="500">Redo</q-tooltip>
				</q-btn>

				<q-space/>

				<q-icon name="mdi-file-music"/>
				<div class="non-selectable">{{ project ? `${ project.name } - ` : '' }}Fannithm Editor</div>

				<q-space/>

				<q-btn dense flat :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
				       @click="toggleFullscreen" v-if="isEnabled">
					<q-tooltip :delay="500">{{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}</q-tooltip>
				</q-btn>
				<q-btn dense flat icon="mdi-close" @click="closeProject">
					<q-tooltip :delay="500">Close Current Project</q-tooltip>
				</q-btn>
			</q-bar>
		</q-header>

		<q-page-container style="height: 100vh">
			<page-start v-if="!project"/>
		</q-page-container>

		<window-container/>
	</q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import PageStart from 'pages/Start.vue';
import WindowContainer from 'components/Window/WindowContainer.vue';
import RecursiveMenu, { RecursiveMenuItem } from 'components/RecursiveMenu.vue';
import { store } from 'src/store';
import { execCommand } from 'src/lib/commands';
import screenfull from 'screenfull';

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
	components: { PageStart, RecursiveMenu, WindowContainer },
	setup: function () {
		// eslint-disable-next-line
		const recentMenu = computed(() => store.getters['project/recentProjectMenu']);
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
						disabled: true
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
						menu: recentMenu as unknown as RecursiveMenuItem[]
					},
					{
						name: 'Open from Disk...',
						disabled: true
					},
					{
						name: 'Close Project',
						click: execCommand('file/closeProject')
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
						disabled: true
					},
					{
						name: 'QQ Group',
						disabled: true
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
			await store.dispatch('project/updateRecentProject');
		});
		const isFullscreen = ref(false);
		if (screenfull.isEnabled) {
			isFullscreen.value = screenfull.isFullscreen;
			screenfull.on('change', () => {
				isFullscreen.value = (screenfull as screenfull.Screenfull).isFullscreen;
			});
		}
		return {
			menu,
			isEnabled: screenfull.isEnabled,
			isFullscreen,
			toggleFullscreen,
			project: computed(() => store.state.project.current),
			closeProject: execCommand('file/closeProject')
		};
	}
});
</script>
