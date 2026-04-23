<template>
  <RouterView />
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { initApp } from '@/processes/init-app/initApp';

  onMounted(() => initApp());
</script>
