<template>
  <select
    :id="selectId"
    :value="displayValue"
    :name="selectId"
    class="app-select"
    :disabled="disabled"
    @change="onChange"
  >
    <option
      value=""
      disabled
    >
      {{ label }}
    </option>

    <option
      v-for="item in list"
      :key="`${keyPrefix}${item.id}`"
      :value="returnObject ? JSON.stringify(item) : item.id"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<script lang="ts" setup generic="T extends { id: string | number; name: string | number }">
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: T | string | number | null;
      value?: T | string | number | null;
      list?: T[];
      selectId: string;
      label?: string;
      returnObject?: boolean;
      keyPrefix?: string;
      disabled?: boolean;
    }>(),
    {
      list: () => [],
      label: '-- Выберите из списка --',
      returnObject: false,
      keyPrefix: '',
      disabled: false,
      modelValue: undefined,
      value: undefined,
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: T | string | number | null];
    'update:value': [value: T | string | number | null];
    change: [event: Event];
  }>();

  const displayValue = computed(() => {
    const val = props.value !== undefined ? props.value : props.modelValue;

    if (val === null || val === undefined) return '';
    if (props.returnObject && typeof val === 'object') return JSON.stringify(val);

    return val;
  });

  const onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const rawValue = target.value;

    if (rawValue === '') {
      emit('update:modelValue', null);
      emit('update:value', null);
      emit('change', event);

      return;
    }

    if (props.returnObject) {
      try {
        const parsed = JSON.parse(rawValue) as T;
        emit('update:modelValue', parsed);
        emit('update:value', parsed);
      } catch {
        emit('update:modelValue', rawValue);
        emit('update:value', rawValue);
      }
    } else {
      emit('update:modelValue', rawValue);
      emit('update:value', rawValue);
    }

    emit('change', event);
  };
</script>

<style scoped>
  .app-select {
    font-size: 12px;
    padding: 4px 8px;
    border: 1px solid #dadada;
    border-radius: 4px;
    background: white;
    outline: none;
    transition: border-color 0.2s;
  }
  .app-select:focus {
    border-color: #7e7eee;
  }
  .app-select:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
</style>
