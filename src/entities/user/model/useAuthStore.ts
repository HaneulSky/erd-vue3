import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usersApi } from '../api';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  async function fetchUser() {
    if (isLoading.value) return;
    
    isLoading.value = true;
    try {
      user.value = await usersApi.me(); 
    } catch (e) {
      user.value = null;
      console.error(e)
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
  };
});