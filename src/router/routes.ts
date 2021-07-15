import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/:catchAll(.*)*',
		component: () => import('layouts/MainLayout.vue')
	}
];

export default routes;
