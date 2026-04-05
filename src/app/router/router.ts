import { createRouter, createWebHistory } from 'vue-router';

import AuthPage from '@/pages/auth/AuthPage.vue';
import DiagramPage from '@/pages/main/DiagramPage.vue';

const routes = [
  {
    path: '/login',
    name: 'auth-login',
    component: AuthPage,
    meta: {
      requiresAuth: false,
      title: 'Авторизация',
    },
  },
  {
    path: '/diagrams',
    name: 'diagrams',
    component: DiagramPage,
    meta: {
      requiresAuth: true,
      title: 'ERD',
    },
  },
  {
    path: '/',
    name: 'home',
    redirect: '/diagrams',
  },
  //    {
  //     path: '/:pathMatch(.*)*',  // TODO
  //     name: 'not-found',
  //     component: () => import('@/pages/not-found/NotFoundPage.vue'),
  //     meta: { title: 'Страница не найдена' },
  //    },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
