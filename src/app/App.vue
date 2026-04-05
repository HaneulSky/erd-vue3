<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
 import { useAuthStore } from '@/entities/user/model/useAuthStore';
 import { useDiagramStore } from '@/entities/diagram/model/useDiagramStore';

 const authStore = useAuthStore();
 const diagramStore = useDiagramStore();

onMounted(async () => {
  try {
    await authStore.fetchUser();
    
    if (authStore.isAuthenticated) {
      await diagramStore.loadDiagrams();
    }
  } catch (e) {
    console.error(e);
  }
});
</script>
