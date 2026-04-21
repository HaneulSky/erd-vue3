import type { Router, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|\\s)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setupRouterGuards(router: Router) {
  router.beforeEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const token = getCookie('access_token');
      const requiresAuth = to.meta.requiresAuth as boolean;

      if (requiresAuth && !token) {
        const redirectPath = to.path;
        next({ name: 'auth-login', query: { redirect: redirectPath } });
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
