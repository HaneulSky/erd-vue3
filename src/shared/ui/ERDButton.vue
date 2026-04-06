<template>
  <button
    v-bind="$attrs"
    class="app-button"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
  defineEmits<{
    (e: 'click'): void;
  }>();
</script>
<style scoped>
  .app-button {
    border: var(--border);
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    padding: 2px;
    background: white;
  }
  .app-button:disabled,
  .app-button[disabled] {
    background-color: #f0f0f0;
    border-color: #c0c0c0;
    color: #999;
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>
