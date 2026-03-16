<template>
      <input
        v-model="localValue"
        :type="props.type"
        :placeholder="props.placeholder"
      >
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    placeholder?: string
    type?: string
  }>(),
  {
    modelValue: null,
    type: 'text',
    placeholder: 'Введите значение',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>