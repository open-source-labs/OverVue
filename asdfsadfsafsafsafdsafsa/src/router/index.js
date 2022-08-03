import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Parent from '../views/Parent.vue';
export default createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [

		{
			path: '/',
			name:'HomeView',
			component:HomeView
		},

		{
			path: '/',
			name:'Parent',
			component:Parent
		},
	]
})
