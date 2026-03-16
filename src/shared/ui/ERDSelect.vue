<template>
  <select
    :id="selectId"
    v-model="localValue"
    name="tableFrom"
  >
    <option value="">
      {{ label }}
    </option>

    <option
      v-for="item in list"
      :key="`from-${item.id}`"
      :value="item.id"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface SelectItem {
  id: string | number
  name: string
  [key: string]: unknown
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    list?: SelectItem[]
    selectId: string
    label?: string
  }>(),
  {
    modelValue: null,
    list: () => [],
    label: '-- Выберите таблицу --',
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