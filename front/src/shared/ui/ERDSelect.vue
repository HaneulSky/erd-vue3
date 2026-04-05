<template>
  <select
    :id="selectId"
    v-model="localValue"
    name="tableFrom"
    class="app-select"
    :disabled="disabled"
  >
    <option value="" disabled>
      {{ label }}
    </option>

    <option
      v-for="item in list"
      :key="`${keyPrefix}${item.id}`"
      :value="returnObject ? item : item.id"
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
    modelValue: string | number | SelectItem | null
    list?: SelectItem[]
    selectId: string
    label?: string
    returnObject?: boolean
    keyPrefix?: string
    disabled?: boolean
  }>(),
  {
    list: () => [],
    label: '-- Выберите из списка --',
    returnObject: false,
    keyPrefix: '',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | SelectItem | null): void
}>()

const localValue = computed({
  get() {
    if (!props.modelValue) return ''

    if (props.returnObject) {
      return props.modelValue
    }

    return props.modelValue
  },

  set(newValue) {
    if (newValue === '') {
      emit('update:modelValue', null)

      return
    }

    if (props.returnObject) {
      emit('update:modelValue', newValue as SelectItem)
    } else {
      emit('update:modelValue', newValue as string | number)
    }
  },
})
</script>

<style scoped>
.app-select {
  font-size: 12px;
}
</style>