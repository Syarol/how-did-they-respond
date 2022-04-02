import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [{ 
		name: 'app',
		path: '/:company',
		component: App,
	}],
});

const app = createApp(App);

app.use(router);

app.mount('#app');
