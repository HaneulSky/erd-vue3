<template>
    <form>
        <label>{{ props.label }}</label>
        <select>
            <option v-for="item in props.list">{{ item }}</option>
        </select>
    </form>
</template>
<script lang="ts" scoped>
const props = withDefaults(defineProps<{
    list: string[]
    label: string
}>(), {
    list: ['-- Выберите название --'],
    label: 'Выберите название'
})
const emit = defineEmits<{
    (e: 'input', value: object): void
}>()
</script>
<style scoped>

</style>