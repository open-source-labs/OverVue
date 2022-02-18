import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
export default createRouter({
	history: createWebHistory(),
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name:'HomeView',
			component:HomeView
		},
	]
})
