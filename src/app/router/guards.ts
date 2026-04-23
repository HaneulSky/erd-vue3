import type { Router } from 'vue-router';

function getAuthToken(): string | null {
  // Пробуем прочитать из кук (работает, когда бэк и фронт на одном домене)
  const cookieMatches = document.cookie.match(new RegExp(
    `(?:^|; )access_token=([^;]*)`
  ));
  if (cookieMatches) {
    return decodeURIComponent(cookieMatches[1]);
  }
  
  // Читаем из localStorage (работает если на разных доменах)
  return localStorage.getItem('access_token');
}

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const token = getAuthToken();
    const requiresAuth = to.meta.requiresAuth as boolean;

    if (requiresAuth && !token) {
      next({ name: 'auth-login', query: { redirect: to.path } });
      return;
    }

    if (!requiresAuth && token && to.name === 'auth-login') {
      next({ name: 'diagrams' });
      return;
    }

    next();
  });
}