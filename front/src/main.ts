import './app/styles/reset.css';
import './app/styles/global.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import { router } from './app/router/router';
import { setupRouterGuards } from './app/router/guards';

const app = createApp(App);

setupRouterGuards(router);

app.use(router);
app.use(createPinia());

app.mount('#app');

