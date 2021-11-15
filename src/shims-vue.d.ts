// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
	import { ComponentOptions } from 'vue';
	const component: ComponentOptions;
	export default component;
}

declare module '*.yaml' {
	interface Lang {
		[key: string]: string | Lang;
	}

	const data: Lang;
	export default data;
}
