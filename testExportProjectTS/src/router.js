import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import testRoute from './views/testRoute.vue'
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
			path: '/testRoute',
			name:'testRoute',
			component: testRoute
		},
	]
})
