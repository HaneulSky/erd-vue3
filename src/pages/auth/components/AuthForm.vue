<template>
  <form
    class="login-form"
    @submit.prevent
  >
    <ERDInput
      v-model="name"
      type="text"
      placeholder="Логин"
      @input="errors.name = ''"
    />
    <span
      v-show="errors.name"
      class="error"
      >{{ errors.name }}</span
    >

    <ERDInput
      v-model="password"
      :type="passwordInputType"
      placeholder="Пароль"
      @input="errors.password = ''"
    >
    <template #append>
      <button
        type="button"
        class="password-toggle"
        @click="togglePassword"
      >
        <EyeIcon v-if="!passwordVisible" />
        <EyeClosedIcon v-else />
      </button>
      
    </template>
    </ERDInput>
    <span
      v-show="errors.password"
      class="error"
      >{{ errors.password }}</span
    >

    <span
      v-show="serverError"
      class="error"
      >{{ serverError }}</span
    >
    <ERDButton :disabled="loading" @click="onSubmit">
      {{ loading ? 'Загрузка...' : buttonTitle }}
    </ERDButton>
  </form>
</template>

<script setup lang="ts">
import ERDButton from '@/shared/ui/ERDButton.vue';
import ERDInput from '@/shared/ui/ERDInput.vue';
import EyeClosedIcon from '@/shared/ui/icons/EyeClosedIcon.vue';
import EyeIcon from '@/shared/ui/icons/EyeIcon.vue';
import { ref, computed } from 'vue';

const props = defineProps<{
  isRegister: boolean;
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: 'on-submit', value: { name: string; password: string }): void;
}>();

const name = ref('');
const password = ref('');
const errors = ref({ password: '', name: '' });
const passwordVisible = ref(false);

const passwordInputType = computed(() =>
  passwordVisible.value ? 'text' : 'password'
);

const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value;
};

const buttonTitle = computed(() =>
  props.isRegister ? 'Зарегистрироваться' : 'Войти'
);

const serverError = computed(() => props.error);

const checkPassword = (password: string) => {
  return password.trim().length >= 6 && password.trim().length <= 16;
};

const checkLogin = (name: string) => {
  return name.trim().length >= 2 && name.trim().length <= 16;
};

const onSubmit = () => {
  errors.value.password = '';
  errors.value.name = '';

  if (!checkPassword(password.value)) {
    errors.value.password = 'Пароль: 6-16 символов';

    return;
  }

  if (!checkLogin(name.value)) {
    errors.value.name = 'Логин: 2-16 символов';

    return;
  }

  emit('on-submit', {
    name: name.value,
    password: password.value,
  });
};
</script>
<style scoped>
  .login-form {
    display: flex;
    gap: 15px;
    flex-direction: column;
    width: 100%;
    font-size: 12px;
  }
  .error {
    color: red;
    font-size: 0.9em;
    min-height: 1.2em;
  }
</style>
