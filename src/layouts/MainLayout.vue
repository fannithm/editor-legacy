<template>
	<q-layout view="lHh Lpr lFf">
		<q-header class="bg-primary text-white">
			<q-bar>
				<q-btn dense flat icon="mdi-menu">
					<q-tooltip :delay="500">Menu</q-tooltip>
					<recursive-menu :menu="menu"/>
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
				<div class="non-selectable">Fannithm Editor</div>

				<q-space/>

				<q-btn dense flat icon="mdi-fullscreen">
					<q-tooltip :delay="500">Fullscreen</q-tooltip>
				</q-btn>
				<q-btn dense flat icon="mdi-close">
					<q-tooltip :delay="500">Close Current Project</q-tooltip>
				</q-btn>
			</q-bar>
		</q-header>

		<q-page-container style="height: 100vh">
			<router-view/>
		</q-page-container>

		<window-container/>
	</q-layout>
</template>

<script lang="ts">
import WindowContainer from 'components/Window/WindowContainer.vue';
import { defineComponent, ref } from 'vue';
import RecursiveMenu from 'components/RecursiveMenu.vue';
import { openNewWindow } from 'src/lib/windowManager';

export default defineComponent({
	components: { RecursiveMenu, WindowContainer },
	setup () {
		const menu = ref([
			{
				name: 'File',
				menu: [
					{
						name: 'New...',
						click: openNewWindow
					}
				]
			}
		]);

		return {
			menu
		};
	}
});
</script>
