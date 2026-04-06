import { defineStore } from 'pinia';
import { ref } from 'vue';
import { diagramApi } from '../api';
import type { DiagramDto, CreateDiagramDto } from '../types';

export const useDiagramStore = defineStore('diagram', () => {
  const selectedDiagramId = ref<string | number | null>(null);
  const diagrams = ref<DiagramDto[]>([]);

  function setSelectedDiagram(id: string | number) {
    selectedDiagramId.value = id;
  }

  async function createDiagram(dto: CreateDiagramDto) {
    try {
      const newDiagram = await diagramApi.create(dto);
      await loadDiagrams();
      selectedDiagramId.value = newDiagram.id;
    } catch (e) {
      console.error(e);
    }
  }

  async function loadDiagrams() {
    try {
      diagrams.value = await diagramApi.list();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteDiagram(id: number) {
    try {
      await diagramApi.delete(id);
    } catch (error) {}
  }

  return {
    selectedDiagramId,
    diagrams,
    setSelectedDiagram,
    createDiagram,
    loadDiagrams,
    deleteDiagram,
  };
});
