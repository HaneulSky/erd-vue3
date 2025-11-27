<template>
    <input
        @input=emit('input', $event.target)
    >
        <slot></slot>
    </input>
</template>
<script lang="ts" scoped>
const emit = defineEmits<{
    (e: 'input', value: string): void
}>()
</script>
<style scoped>

</style>