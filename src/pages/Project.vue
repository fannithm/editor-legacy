<template>
	<div class="full-width full-height row justify-center items-center">
		<div>
			<p class="text-center text-h6">
				Start With...
			</p>
			<q-list bordered separator class="non-selectable" style="min-width: 280px;">
				<q-item clickable v-ripple @click="newMap">
					<q-item-section avatar class="q-item__section--icon">
						<q-icon color="primary" name="mdi-plus"/>
					</q-item-section>
					<q-item-section>
						Create a new map...
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple @click="resourceManager">
					<q-item-section avatar class="q-item__section--icon">
						<q-icon color="primary" name="mdi-package-variant-closed"/>
					</q-item-section>
					<q-item-section>
						Resource Manager...
					</q-item-section>
				</q-item>
				<q-item clickable v-ripple>
					<q-item-section>
						<q-item-label>
							expert.json
						</q-item-label>
						<q-item-label caption>
							<q-badge color="red" text-color="white">
								Expert (26)
							</q-badge>
						</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { store } from 'src/store';
import { execCommand } from 'src/lib/commands';

export default defineComponent({
	name: 'PageProject',
	setup () {
		const project = computed(() => store.state.project.current);
		return {
			project,
			newMap: execCommand('file/newMapWindow'),
			resourceManager: execCommand('file/resourceManagerWindow')
		};
	}
});
</script>

<style scoped>

</style>