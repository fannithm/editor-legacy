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
					<q-menu anchor="bottom left" self="top start">
						<recursive-menu :menu="openMenu"/>
					</q-menu>
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

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { BUILT_TIME, COMMIT, VERSION } from 'src/lib/const';
import dayjs from 'dayjs';
import RecursiveMenu, { RecursiveMenuItem } from 'components/RecursiveMenu.vue';
import { execCommand } from 'src/lib/commands';
import { recentProjectMenu } from 'src/store/project';

export default defineComponent({
	name: 'PageStart',
	components: { RecursiveMenu },
	setup () {
		const version = ref(VERSION as string);
		const hash = ref(COMMIT as string);
		const time = ref(dayjs(BUILT_TIME || undefined).format());
		const openMenu = reactive([
			{
				name: 'Open...',
				click: execCommand('file/openProjectWindow')
			},
			{
				name: 'Open Recent',
				menu: recentProjectMenu as unknown as RecursiveMenuItem[]
			}
		]);

		return {
			version,
			hash,
			time,
			openMenu,
			goToDocs: execCommand('help/documentation'),
			newWindow: execCommand('file/newProjectWindow')
		};
	}
});
</script>
<style scoped>

</style>
