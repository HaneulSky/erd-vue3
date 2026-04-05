import type { Router, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function setupRouterGuards(router: Router) {
  router.beforeEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const token = getCookie('access_token');
      const requiresAuth = to.meta.requiresAuth as boolean;

      if (requiresAuth && !token) {
        next({ name: 'auth-login', query: { redirect: to.fullPath } });
        return;
      }

      if (!requiresAuth && token && to.name === 'auth-login') {
        next({ name: 'diagrams' });
        return;
      }

      next();
    }
  );
}
