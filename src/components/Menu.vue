<template>
	<q-menu self="top start" anchor="bottom left">
		<q-list dense style="min-width: 100px;">
			<template v-for="menu in props.menu" :key="key + menu.key">
				<q-item :clickable="calcEnable(menu.enable)" :disable="!calcEnable(menu.enable)"
				        v-close-popup="menu.menu || calcEnable(menu.enable)"
				        style="padding-left: 0;"
				        v-if="menu.key && calcEnable(menu.display)"
				        @click="!menu.menu && onItemClick(key + menu.key, menu.onClick)">
					<q-item-section avatar class="q-item__section--icon">
						<q-icon :name="menu.icon" size="xs"/>
					</q-item-section>
					<q-item-section>{{ getLabel(menu) }}{{ menu.followingStep ? '...' : '' }}
					</q-item-section>
					<template v-if="menu.menu">
						<q-item-section side>
							<q-icon name="mdi-chevron-right"/>
						</q-item-section>
						<Menu :menu="menu.menu" :i18n-global-key="i18nGlobalKey" :parentKey="key + menu.key"
						      anchor="top end" self="top start" @click="payload => emit('click', payload)"/>
					</template>
					<q-item-section side v-else-if="menu.hotkey">
						<q-item-label caption>{{ menu.hotkey }}</q-item-label>
					</q-item-section>
				</q-item>
				<q-separator v-if="menu.separator && calcEnable(menu.display)"/>
			</template>
		</q-list>
	</q-menu>
</template>

<script setup lang="ts">
import { IMenu, IMenuItem } from '../lib/menu';
import mapState from 'src/store/map';
import projectState from 'src/store/project';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	menu: IMenu,
	parentKey?: string,
	i18nGlobalKey?: string,
}>();
const emit = defineEmits<{
	(e: 'click', key: string): void
}>();
const parentKey = props.parentKey || '';
const key = `${ parentKey ? parentKey + '.' : '' }`;
const i18nKey = `${ props.i18nGlobalKey ? props.i18nGlobalKey + '.' : '' }${ key ? key : '' }`;

function calcEnable(enable?: 'map' | 'project' | boolean | (() => boolean)): boolean {
	if (enable === undefined) return true;
	else if (typeof enable === 'function') return enable();
	else if (typeof enable === 'boolean') return enable;
	else if (enable === 'map') {
		return Boolean(mapState.map);
	} else {
		return Boolean(projectState.current);
	}
}

function onItemClick(key: string, onClick?: () => void): void {
	if (onClick) onClick();
	else emit('click', key);
}

const i18n = useI18n();

function getLabel(menu: IMenuItem): string {
	if (menu.label) {
		return menu.label[0] === '$' ? i18n.t(menu.label.substr(1)) : menu.label;
	}
	return i18n.t(`${ i18nKey }${ menu.key || '' }${ menu.menu ? '.label' : '' }`);
}
</script>

<style scoped>

</style>
