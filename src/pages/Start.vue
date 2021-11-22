<template>
	<div class="full-width full-height row justify-center items-center">
		<div>
			<p class="text-center text-h5 q-mb-lg">
				Welcome to Fannithm Editor
			</p>
			<div class="row justify-center">
				<q-btn @click="newWindow" icon="mdi-file" label="New" stack outline color="primary" size="md"
				       padding="sm md" style="width: 84px"/>
				<q-btn icon="mdi-folder-open-outline" label="Open" stack outline color="primary" size="md"
				       padding="sm md" class="q-mx-md" style="width: 84px">
					<Menu :menu="openMenu" i18n-global-key="start.openMenu"/>
				</q-btn>
				<q-btn icon="mdi-book-open-variant" label="Learn" stack outline color="primary" size="md"
				       padding="sm md" style="width: 84px" @click="goToDocs"/>
			</div>
			<p class="text-center q-mt-md q-mb-sm">
				Fannithm Editor
				<a :href="`https://github.com/Fannithm/Editor/tree/${hash}`" target="_blank" class="link">
					{{ version }}@{{ hash }}
					<q-tooltip :delay="500">
						{{ time }}
					</q-tooltip>
				</a>
			</p>
			<p class="text-center">
				<a href="https://vercel.com/?utm_source=Fannithm&utm_campaign=oss" target="_blank">
					<img height="28"
					     src="~src/assets/vercel.svg"
					     alt="vercel">
				</a>
			</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { BUILT_TIME, COMMIT, VERSION } from 'src/lib/const';
import dayjs from 'dayjs';
import { recentProjectMenu } from 'src/store/project';
import { IMenuItem } from 'src/lib/menu';
import Menu from 'components/Menu.vue';
import { execCommand } from 'src/lib/execCommand';

const version = ref(VERSION as string);
const hash = ref(COMMIT as string);
const time = ref(dayjs(BUILT_TIME || undefined).format());
const openMenu = reactive<IMenuItem[]>([
	{
		key: 'open',
		followingStep: true,
		onClick: execCommand('file/openProjectWindow')
	},
	{
		key: 'openRecent',
		menu: recentProjectMenu as unknown as IMenuItem[]
	}
]);
const newWindow = execCommand('file/newProjectWindow');
const goToDocs = execCommand('help/documentation');
</script>
<style scoped>

</style>
