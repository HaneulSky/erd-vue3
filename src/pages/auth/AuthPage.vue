<template>
  <div class="login-page">
    <p>{{ formTitle }}</p>
    <AuthForm
      :is-register="isRegister"
      @on-submit="onSubmit"
    />
    <ERDButton
      class="change-form-btn"
      @click="changeForm"
    >
      {{ spanTitle }}
    </ERDButton>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AuthForm from './components/AuthForm.vue';
  import { authApi } from '@/entities/user/api';
  import { ApiError } from '@/shared/api/client';
  import type { LoginDto, RegisterDto } from '@/entities/user/types';
  import ERDButton from '@/shared/ui/ERDButton.vue';
  import { useAuthStore } from '@/entities/user/model/useAuthStore';

  const authStore = useAuthStore();

  const router = useRouter();
  const route = useRoute();

  const isLoading = ref(false);
  const serverError = ref('');
  const isRegister = ref(false);

  const formTitle = computed(() => (isRegister.value ? 'Регистрация' : 'Вход'));
  const spanTitle = computed(() =>
    isRegister.value ? 'Уже зарегистрированы?' : 'Еще не зарегистрированы?'
  );

  const catchError = (e: unknown) => {
    if (e instanceof ApiError) {
      serverError.value = `Ошибка ${e.status}: ${e.message}`;
    } else {
      serverError.value = 'Неизвестная ошибка. Попробуйте позже.';
    }
  };

  const login = async (data: LoginDto) => {
    isLoading.value = true;
    try {
      await authApi.login(data);
    } catch (e) {
      catchError(e);
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (data: RegisterDto) => {
    isLoading.value = true;
    try {
      await authApi.register(data);
    } catch (e) {
      catchError(e);
    } finally {
      isLoading.value = false;
    }
  };

  const onSubmit = async (data: LoginDto | RegisterDto) => {
    try {
      if (isRegister.value) {
        await register(data);
      } else {
        await login(data);
      }

      await authStore.fetchUser();

      const redirectPath = route.query.redirect;

      if (redirectPath && typeof redirectPath === 'string') {
          const url = new URL(redirectPath, window.location.origin);
          router.push(url.pathname); 
      } else {
          router.push({ name: 'diagrams' });
      }
    } catch (e) {
      console.error('Request failed:', e);
    }
  };

  const changeForm = () => {
    isRegister.value = !isRegister.value;
  };
</script>
<style scoped>
  .login-page {
    display: flex;
    gap: 15px;
    flex-direction: column;
    align-items: center;
    width: 300px;
    border: var(--border);
    box-shadow: 0 0 9px 0;
    margin: 20px auto;
    padding: 15px;
  }
  .change-form-btn {
    color: midnightblue;
  }
</style>
