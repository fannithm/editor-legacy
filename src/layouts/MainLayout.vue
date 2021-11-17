<template>
	<q-layout view="lHh Lpr lFf">
		<q-header class="bg-primary text-white">
			<q-bar>
				<q-btn dense flat icon="mdi-menu">
					<q-tooltip :delay="500">Menu</q-tooltip>
					<Menu :menu="menu" key="menu" i18n-global-key="menu" @click="onMenuClick"/>
				</q-btn>
				<template v-if="project">
					<q-btn dense flat icon="mdi-content-save" @click="save">
						<q-tooltip :delay="500">Save</q-tooltip>
					</q-btn>
					<q-btn dense flat icon="mdi-undo" disabled>
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
				       @click="toggleFullscreen" v-if="screenfull.isEnabled">
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

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import PageStart from 'pages/Start.vue';
import PageProject from 'pages/Project.vue';
import WindowContainer from 'components/Window/WindowContainer.vue';
import Menu from 'components/Menu.vue';
import { execCommand } from 'src/lib/commands';
import screenfull from 'screenfull';
import projectState, { recentProjectMenu, updateRecentProject } from 'src/store/project';
import mapState from 'src/store/map';
import ProjectMetaManager from 'src/lib/ProjectMetaManager';
import { IMenu, IMenuItem } from 'src/lib/menu';
import hotkeys, { formatAsDisplay } from 'src/lib/hotkey';

function toggleFullscreen() {
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

const menu = reactive<IMenu>([{
	key: 'file',
	icon: 'mdi-file',
	menu: [{
		key: 'newProjectWindow',
		followingStep: true
	}, {
		key: 'newMapWindow',
		followingStep: true,
		display: 'project'
	}, {
		separator: true
	}, {
		key: 'openProjectWindow',
		icon: 'mdi-folder-open',
		followingStep: true
	}, {
		key: 'openRecent',
		menu: recentProjectMenu as unknown as IMenuItem[]
	}, {
		key: 'openFromDisk',
		enable: false,
		followingStep: true,
		separator: true
	}, {
		key: 'save',
		display: 'project',
		hotkey: formatAsDisplay(hotkeys['file/save']),
		icon: 'mdi-content-save'
	}, {
		key: 'saveAs',
		display: 'project',
		enable: false,
		followingStep: true
	}, {
		key: 'saveToDisk',
		enable: false,
		display: 'project'
	}, {
		separator: true,
		display: 'project'
	}, {
		key: 'closeMap',
		display: 'map'
	}, {
		key: 'closeProject',
		display: 'project',
		separator: true
	}, {
		key: 'resourceManagerWindow',
		icon: 'mdi-package-variant-closed',
		display: 'project',
		followingStep: true,
		hotkey: formatAsDisplay(hotkeys['file/resourceManager']),
		separator: true
	}, {
		key: 'clearData',
		followingStep: true
	}]
}, {
	key: 'edit',
	icon: 'mdi-pencil',
	display: 'map',
	menu: [{
		key: 'undo',
		icon: 'mdi-undo',
		enable: false
	}, {
		key: 'redo',
		icon: 'mdi-redo',
		enable: false,
		separator: true
	}, {
		key: 'cut',
		icon: 'mdi-content-cut',
		enable: false
	}, {
		key: 'copy',
		icon: 'mdi-content-copy',
		enable: false
	}, {
		key: 'paste',
		icon: 'mdi-content-paste',
		enable: false
	}, {
		key: 'pasteOption',
		followingStep: true,
		enable: false
	}, {
		key: 'delete',
		icon: 'mdi-delete',
		enable: false,
		separator: true
	}, {
		key: 'find',
		icon: 'mdi-magnify',
		enable: false
	}, {
		key: 'selectAll',
		enable: false
	}, {
		key: 'expandSlideSelection',
		enable: false,
		separator: true
	}, {
		key: 'duplicateSelection',
		enable: false
	}]
}, {
	key: 'help',
	icon: 'mdi-help-circle',
	menu: [{
		key: 'documentation',
		icon: 'mdi-book-open-variant'
	}, {
		key: 'github',
		icon: 'mdi-github',
		separator: true
	}, {
		key: 'discord',
		icon: 'mdi-discord',
		separator: true
	}, {
		key: 'update',
		icon: 'mdi-update',
		enable: false
	}, {
		key: 'about',
		icon: 'mdi-information',
		enable: false
	}]
}]);

function onMenuClick(key: string) {
	execCommand(key.split('.').join('/') as never)();
}

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

const close = () => {
	(map.value ? execCommand('file/closeMap') : execCommand('file/closeProject'))();
};
const save = execCommand('file/save');


const project = computed(() => projectState.current);
const map = computed(() => mapState.map);

const title = computed(() => {
	const projectSaved = computed(() => projectState.saved);
	const mapSaved = computed(() => mapState.saved);
	const mapName = computed(() => mapState.name);

	return (mapName.value ? `${ mapSaved.value ? '' : '*' }${ mapName.value } - ${ (project.value as ProjectMetaManager).name } - ` :
		project.value ? `${ projectSaved.value ? '' : '*' }${ project.value.name } - ` : '') + 'Fannithm Editor';
});
</script>
