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
import { computed, defineComponent, ref, reactive } from 'vue';
import { openURL } from 'quasar';
import { VERSION, COMMIT, BUILT_TIME } from 'src/lib/const';
import { openNewWindow, openOpenWindow } from 'src/lib/windowManager';
import dayjs from 'dayjs';
import RecursiveMenu, { RecursiveMenuItem } from 'components/RecursiveMenu.vue';
import { useStore } from 'src/store';

export default defineComponent({
	name: 'PageStart',
	components: { RecursiveMenu },
	setup () {
		const store = useStore();
		const version = ref(VERSION as string);
		const hash = ref(COMMIT as string);
		const time = ref(dayjs(BUILT_TIME || undefined).format());
		// eslint-disable-next-line
		const recentMenu = computed(() => store.getters['project/recentProjectMenu']);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const openMenu = reactive([
			{
				name: 'Open...',
				click: openOpenWindow
			},
			{
				name: 'Open Recent',
				menu: recentMenu as unknown as RecursiveMenuItem[]
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
