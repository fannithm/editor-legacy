<template>
	<q-menu :anchor="top ? 'bottom left' : 'top end'" :self="top ? 'top left': 'top start'">
		<q-list dense style="min-width: 100px;">
			<template v-for="(item, index) in menu">
				<q-separator v-if="item.separator" :key="'sep-' + index"/>
				<q-item v-else clickable v-close-popup="item.menu" :key="index" @click="item.click">
					<q-item-section>{{ item.name }}</q-item-section>
					<q-item-section side v-if="item.menu">
						<q-icon name="mdi-chevron-right"/>
					</q-item-section>
					<recursive-menu v-if="item.menu" :menu="item.menu" :top="false"/>
				</q-item>
			</template>

		</q-list>
	</q-menu>
</template>

<script lang="ts">

export default {
	name: 'RecursiveMenu',
	props: {
		menu: {
			type: Array as unknown as RecursiveMenu,
			required: true
		},
		top: {
			type: Boolean,
			default: true
		}
	}
};

declare type RecursiveMenu = {
	name?: string,
	click: () => void,
	menu?: RecursiveMenu,
	separator?: boolean
}[]
</script>
