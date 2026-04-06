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
    />
    <span
      v-show="errors.password"
      class="error"
      >{{ errors.password }}</span
    >

    <span
      v-show="errors.server"
      class="error"
      >{{ errors.server }}</span
    >

    <ERDButton @click="onSubmit">
      {{ buttonTitle }}
    </ERDButton>
  </form>
</template>

<script setup lang="ts">
  import ERDButton from '@/shared/ui/ERDButton.vue';
  import ERDInput from '@/shared/ui/ERDInput.vue';
  import { ref, computed } from 'vue';

  const props = defineProps<{ isRegister: boolean }>();

  const emit = defineEmits<{
    (e: 'on-submit', value: { name: string; password: string }): void;
  }>();

  const name = ref('');
  const password = ref('');
  const passwordInputType = ref('password');
  const errors = ref({ password: '', name: '', server: '' });

  const buttonTitle = computed(() => (props.isRegister ? 'Зарегистрироваться' : 'Войти'));

  const checkPassword = (password: string) => {
    if (password?.trim().length < 6 || password?.trim().length > 16) return false;

    return true;
  };

  const checkLogin = (name: string) => {
    if (name?.trim().length < 2 || name?.trim().length > 16) return false;

    return true;
  };

  const onSubmit = async () => {
    errors.value.password = '';
    errors.value.name = '';
    errors.value.server = '';

    if (!checkPassword(password.value)) {
      errors.value.password = 'Пароль: 6-16 символов';

      return;
    }

    if (!checkLogin(name.value)) {
      errors.value.name = 'Логин: 2-16 символов';

      return;
    }

    emit('on-submit', { name: name.value, password: password.value });
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
