<template>
  <header class="app-header">
    <ERDSelect
      v-model="currentDiagram"
      :list="list"
      select-id="user-diagramms"
      label="Диаграммы"
      return-object
    />
    <ERDButton
      class="app-header__button"
      @click="showSettingsModal"
    >
      Настройки
    </ERDButton>
    <!-- <ERDButton 
      class="app-header__button" 
      @click="showCreateDiagramModal"
    >
      Новая диаграмма
    </ERDButton> -->
    <ERDButton
      class="app-header__button"
      @click="logout"
    >
      Выйти
    </ERDButton>
  </header>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import ERDSelect from '@/shared/ui/ERDSelect.vue';
  import ERDButton from '@/shared/ui/ERDButton.vue';
  import { useDiagramStore } from '@/entities/diagram/model/useDiagramStore';
  import { useAuthStore } from '@/entities/user/model/useAuthStore';
  import { authApi } from '@/entities/user/api';
  import { useDiagramModalStore } from '@/features/diagram-management/model/useDiagramModalStore';

  const diagramsStore = useDiagramStore();
  const createDiagramModalStore = useDiagramModalStore();
  const authStore = useAuthStore();
  const router = useRouter();

  const list = computed(() => diagramsStore.diagrams);

  defineEmits<{
    (e: 'select-diagram', value: number | string | null): void;
  }>();

  const currentDiagram = ref(null);

  const logout = async () => {
    try {
      await authApi.logout();
      authStore.logout();
      router.push({ name: 'auth-login' });
    } catch (e) {
      console.error(e);
    }
  };
  const showSettingsModal = () => {
    createDiagramModalStore.setCreateModalOpen(true);
  };
</script>
<style scoped>
  .app-header {
    width: 100%;
    display: grid;
    grid-template-columns: 20% 1fr 10%;
    gap: 5px;
    border-bottom: var(--border);
    padding: 5px;
    font-size: 12px;
  }
</style>
