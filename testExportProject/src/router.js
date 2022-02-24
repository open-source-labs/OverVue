import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import routeTest from './views/routeTest.vue'
export default createRouter({
	history: createWebHistory(),
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name:'HomeView',
			component:HomeView
		},
		{
			path: '/routeTest',
			name:'routeTest',
			component: routeTest
		},
	]
})
