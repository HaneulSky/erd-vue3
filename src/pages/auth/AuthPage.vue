<template>
  <div class="login-page">
    <p>{{ formTitle }}</p>

    <AuthForm
      :is-register="isRegister"
      :loading="isLoading"
      :error="serverError"
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
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import AuthForm from './components/AuthForm.vue';
import ERDButton from '@/shared/ui/ERDButton.vue';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import type { LoginDto, RegisterDto } from '@/entities/user/types';

const authStore = useAuthStore();

const { isLoading, serverError } = storeToRefs(authStore);
const { submit, fetchUser } = authStore;

const router = useRouter();
const route = useRoute();

const isRegister = ref(false);

const formTitle = computed(() =>
  isRegister.value ? 'Регистрация' : 'Вход'
);

const spanTitle = computed(() =>
  isRegister.value
    ? 'Уже зарегистрированы?'
    : 'Еще не зарегистрированы?'
);

const handleRedirect = () => {
  const redirectPath = route.query.redirect;

  if (
    redirectPath &&
    typeof redirectPath === 'string' &&
    redirectPath.startsWith('/')
  ) {
    try {
      const url = new URL(redirectPath, window.location.origin);

      return router.push(url.pathname);
    } catch {
      return router.push({ name: 'diagrams' });
    }
  }

  return router.push({ name: 'diagrams' });
};

const onSubmit = async (data: LoginDto | RegisterDto) => {
  try {
    await submit(data, isRegister.value);
    await fetchUser();
    await handleRedirect();
  } catch (e) {
    console.error('Request failed:', e);
  }
};

const changeForm = () => {
  isRegister.value = !isRegister.value;
  authStore.serverError = '';
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