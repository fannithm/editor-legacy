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
			<p class="text-center  q-mt-md">
				Fannithm Editor
				<a href="https://github.com/Fannithm/Editor" target="_blank" class="link">
					{{ version }}@{{ hash }}
				</a>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { openURL } from 'quasar';
import { VERSION, COMMIT } from 'src/lib/const';
import { useStore } from 'vuex';
import { storeKey } from 'src/store';

export default defineComponent({
	name: 'PageStart',
	setup () {
		const store = useStore(storeKey);
		const version = ref(VERSION as string);
		const hash = ref(COMMIT as string);

		return {
			version,
			hash,
			goToDocs: () => {
				openURL('https://www.wolai.com/qingfuchan/t2L4p4PrUKhcfB48gWjvbJ');
			},
			openNewWindow () {
				store.commit('ui/showNewWindow');
			}
		};
	}
});
</script>
<style scoped>

</style>
