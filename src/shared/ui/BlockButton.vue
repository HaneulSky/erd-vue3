<template>
    <button
        @click=emit('click')
    >
        <slot></slot>
    </button>
</template>
<script lang="ts" scoped>
const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>
<style scoped>

</style>