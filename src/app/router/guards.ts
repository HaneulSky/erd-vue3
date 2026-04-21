import type { Router } from 'vue-router';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.meta.requiresAuth as boolean;

    if (requiresAuth && !authStore.isAuthenticated && !authStore.isLoading) {
      await authStore.fetchUser();
    }

    if (requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'auth-login', query: { redirect: to.path } });
      return;
    }

    if (!requiresAuth && authStore.isAuthenticated && to.name === 'auth-login') {
      next({ name: 'diagrams' });
      return;
    }

    next();
  });
}