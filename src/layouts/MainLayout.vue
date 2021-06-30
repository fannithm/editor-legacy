<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated class="bg-primary text-white">
			<q-bar>
				<q-btn dense flat icon="mdi-menu">
					<q-tooltip :delay="500">Menu</q-tooltip>
					<q-menu>
						<q-list dense style="min-width: 100px">
							<q-item clickable>
								<q-item-section>File</q-item-section>
								<q-item-section side>
									<q-icon name="mdi-chevron-right"/>
								</q-item-section>
								<q-menu anchor="top end" self="top start">
									<q-list dense style="min-width: 100px">
										<q-item clickable v-close-popup>
											<q-item-section>New...</q-item-section>
										</q-item>
										<q-item clickable v-close-popup>
											<q-item-section>Open...</q-item-section>
										</q-item>
										<q-item clickable>
											<q-item-section>Open Recent</q-item-section>
											<q-item-section side>
												<q-icon name="mdi-chevron-right"/>
											</q-item-section>
										</q-item>
										<q-item clickable v-close-popup>
											<q-item-section>Open from Disk...</q-item-section>
										</q-item>

										<q-separator/>

										<q-item clickable v-close-popup>
											<q-item-section>Save</q-item-section>
										</q-item>
										<q-item clickable v-close-popup>
											<q-item-section>Save to Disk...</q-item-section>
										</q-item>
										<q-separator/>

										<q-item clickable v-close-popup>
											<q-item-section>Preferences...</q-item-section>
										</q-item>

										<q-separator/>

										<q-item clickable v-close-popup>
											<q-item-section>Close Project</q-item-section>
										</q-item>
									</q-list>
								</q-menu>
							</q-item>
							<q-item clickable>
								<q-item-section>Edit</q-item-section>
							</q-item>
						</q-list>
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
	</q-layout>
</template>

<script lang="ts" setup>
</script>
