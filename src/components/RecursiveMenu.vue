<template>
	<q-list dense style="min-width: 100px;">
		<template v-for="(item, index) in menu">
			<q-separator v-if="item.separator" :key="'sep-' + index"/>
			<q-item v-else :clickable="!item.disabled" :disable="item.disabled"
			        v-close-popup="item.menu || !item.disabled" :key="index" @click="item.click">
				<q-item-section>{{ item.name }}</q-item-section>
				<q-item-section side v-if="item.menu">
					<q-icon name="mdi-chevron-right"/>
				</q-item-section>
				<q-menu anchor="top end" self="top start">
					<recursive-menu v-if="item.menu" :menu="item.menu" :top="false"/>
				</q-menu>
			</q-item>
		</template>
	</q-list>
</template>

<script lang="ts">

export default {
	name: 'RecursiveMenu',
	props: {
		menu: {
			type: Array as unknown as RecursiveMenuItem[],
			required: true
		}
	}
};

export interface RecursiveMenuItem {
	name?: string,
	click?: () => void,
	menu?: RecursiveMenuItem[],
	disabled?: boolean,
	separator?: boolean
}
</script>
