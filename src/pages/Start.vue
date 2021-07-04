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
					<q-menu>
						<q-list style="min-width: 100px" dense>
							<q-item clickable v-close-popup>
								<q-item-section>Open...</q-item-section>
							</q-item>
							<q-item clickable>
								<q-item-section>Open Recent</q-item-section>
								<q-item-section side>
									<q-icon name="mdi-chevron-right"/>
								</q-item-section>
								<q-menu anchor="top end" self="top start">
									<q-list style="min-width: 100px" dense>
										<q-item clickable>
											<q-item-section>1</q-item-section>
										</q-item>
									</q-list>
								</q-menu>
							</q-item>
							<q-separator/>
							<q-item clickable v-close-popup>
								<q-item-section>Open from Disk...</q-item-section>
							</q-item>
						</q-list>
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
import { openNewWindow } from 'src/lib/windowManager';
import dayjs from 'dayjs';

export default defineComponent({
	name: 'PageStart',
	setup () {
		const version = ref(VERSION as string);
		const hash = ref(COMMIT as string);
		const time = ref(dayjs(BUILT_TIME || undefined).format());

		return {
			version,
			hash,
			time,
			goToDocs: () => {
				openURL('https://www.wolai.com/qingfuchan/t2L4p4PrUKhcfB48gWjvbJ');
			},
			openNewWindow
		};
	}
});
</script>
<style scoped>

</style>
