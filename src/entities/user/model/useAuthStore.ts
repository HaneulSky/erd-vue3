import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usersApi, authApi } from '../api';
import type { User, LoginDto, RegisterDto } from '../types';
import { ApiError } from '@/shared/api/client';
import { tokenService } from '@/shared/lib/auth/token';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const serverError = ref('');

  const isAuthenticated = computed(() => !!user.value);

  const catchError = (e: unknown) => {
    if (e instanceof ApiError) {
      serverError.value = `Ошибка ${e.status}: ${e.message}`;
    } else {
      serverError.value = 'Неизвестная ошибка';
    }
  };

  const submit = async (data: LoginDto | RegisterDto, isRegister: boolean) => {
    isLoading.value = true;
    serverError.value = '';

    try {
      const response = isRegister
        ? await authApi.register(data as RegisterDto)
        : await authApi.login(data as LoginDto);

      if (response?.accessToken) {
        tokenService.set(response.accessToken);
      }
    } catch (e) {
      catchError(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  async function fetchUser() {
    if (isLoading.value) return;

    isLoading.value = true;

    try {
      user.value = await usersApi.me();
    } catch (e) {
      console.error(`Fetch user failed: ${e}`);
      user.value = null;
      tokenService.remove(); // 🔥 важно — если токен битый
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    tokenService.remove();
  }

  async function initAuth() {
    const token = tokenService.get();

    if (!token) return;

    await fetchUser();
  }

  /**
   * ⚠️ Auth хранится в localStorage (access_token)
   *
   * Причина:
   * В продакшене frontend и backend на разных доменах,
   * поэтому cookies не работают (same-site / domain).
   *
   * Для пет-проекта выбран упрощённый подход.
   *
   * В production:
   * - httpOnly cookies
   * - или единый origin (nginx / BFF)
   */

  return {
    user,
    isLoading,
    isAuthenticated,
    serverError,

    submit,
    fetchUser,
    initAuth,
    logout,
  };
});
