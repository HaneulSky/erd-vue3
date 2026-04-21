import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usersApi, authApi } from '../api';
import type { User, LoginDto, RegisterDto } from '../types';
  import { ApiError } from '@/shared/api/client';

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

  const submit = async (
    data: LoginDto | RegisterDto,
    isRegister: boolean
  ) => {
    isLoading.value = true;

    try {
      if (isRegister) {
        await authApi.register(data as RegisterDto);
      } else {
        await authApi.login(data as LoginDto);
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
    } finally {
      isLoading.value = false;
    }
  }

  function clearUser() {
    user.value = null;
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    fetchUser,
    clearUser,
    submit,
    serverError
  };
});
