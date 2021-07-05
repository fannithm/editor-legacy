<template>
	<div class="full-width full-height row justify-center items-center">
		<div>
			<p class="text-center text-h5 q-mb-lg">
				Welcome to Fannithm Editor
			</p>
			<div class="row justify-center">
				<q-btn @click="openNewWindow" icon="mdi-file" label="New" stack outline color="primary" size="md"
				       padding="sm md" style="width: 84px"/>
				<q-btn icon="mdi-folder-open-outline" label="Open" stack outline color="primary" size="md"
				       padding="sm md" class="q-mx-md" style="width: 84px">
					<recursive-menu :menu="openMenu"/>
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
				<a href="https://vercel.com" target="_blank">
					<img
						src="https://img.shields.io/badge/Built%20with%20Vercel-black?logo=vercel&labelColor=black"
						alt="vercel">
				</a>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { openURL } from 'quasar';
import { VERSION, COMMIT, BUILT_TIME } from 'src/lib/const';
import { openNewWindow, openOpenWindow } from 'src/lib/windowManager';
import dayjs from 'dayjs';
import RecursiveMenu from 'components/RecursiveMenu.vue';

export default defineComponent({
	name: 'PageStart',
	components: { RecursiveMenu },
	setup () {
		const version = ref(VERSION as string);
		const hash = ref(COMMIT as string);
		const time = ref(dayjs(BUILT_TIME || undefined).format());
		const openMenu = ref([
			{
				name: 'Open...',
				click: openOpenWindow
			},
			{
				name: 'Open Recent',
				menu: [
					{
						name: '1'
					}
				]
			},
			{
				separator: true
			},
			{
				name: 'Open from Disk...'
			}
		]);

		return {
			version,
			hash,
			time,
			openMenu,
			goToDocs: () => {
				openURL('https://www.wolai.com/qingfuchan/t2L4p4PrUKhcfB48gWjvbJ');
			},
			openNewWindow,
			openOpenWindow
		};
	}
});
</script>
<style scoped>

</style>
