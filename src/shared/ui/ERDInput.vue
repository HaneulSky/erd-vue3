<template>
  <div class="app-input-wrapper">
    <input
      :value="displayValue"
      :type="props.type"
      :placeholder="props.placeholder"
      class="app-input"
      @input="onInput"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
    />

    <div
      v-if="$slots.append"
      class="app-input-append"
    >
      <slot name="append" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: string | number | null;
      value?: string | number | null;
      placeholder?: string;
      type?: string;
    }>(),
    {
      type: 'text',
      placeholder: 'Введите значение',
      modelValue: undefined,
      value: undefined,
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string | number | null];
    'update:value': [value: string | number | null];
    blur: [event: FocusEvent];
    change: [event: Event];
  }>();

  const displayValue = computed(() => {
    if (props.value !== undefined) {
      return props.value;
    }
    if (props.modelValue !== undefined) {
      return props.modelValue;
    }

    return '';
  });

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    emit('update:modelValue', value);
    emit('update:value', value);
  };
</script>

<style scoped>
  .app-input-wrapper {
    position: relative;
    width: 100%;
  }

  .app-input {
    font-size: 12px;
    padding: 8px 12px;
    padding-right: 36px;
    border: var(--border);
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }

  .app-input-append {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
  }
</style>
