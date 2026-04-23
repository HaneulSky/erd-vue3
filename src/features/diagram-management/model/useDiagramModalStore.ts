import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { DiagramDto } from '@/entities/diagram/types';

export const useDiagramModalStore = defineStore('diagram-modal', () => {
  const isCreateModalOpen = ref(false);

  const diagrams = ref<DiagramDto[]>([]);
  const selectedDiagramId = ref<string | number | null>(null);

  function setCreateModalOpen(value: boolean) {
    isCreateModalOpen.value = value;
  }

  return {
    isCreateModalOpen,
    diagrams,
    selectedDiagramId,
    setCreateModalOpen,
  };
});
