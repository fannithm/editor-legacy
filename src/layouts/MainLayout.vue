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
				<q-btn dense flat icon="mdi-close">
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
import WindowContainer from 'components/Window/WindowContainer.vue';
import { defineComponent, onMounted, ref, computed } from 'vue';
import RecursiveMenu, { RecursiveMenuItem } from 'components/RecursiveMenu.vue';
import { openNewWindow, openOpenWindow } from 'src/lib/windowManager';
import { useStore } from 'src/store';
import screenfull from 'screenfull';
import PageStart from 'pages/Start.vue';

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
		const store = useStore();
		// eslint-disable-next-line
		const recentMenu = computed(() => store.getters['project/recentProjectMenu']);
		const menu = ref<RecursiveMenuItem[]>([
			{
				name: 'File',
				menu: [
					{
						name: 'New...',
						click: openNewWindow
					},
					{
						separator: true
					},
					{
						name: 'Open...',
						click: openOpenWindow
					},
					{
						name: 'Open Recent',
						menu: recentMenu as unknown as RecursiveMenuItem[]
					},
					{
						name: 'Open from Disk...'
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
			project: computed(() => store.state.project.current)
		};
	}
});
</script>
