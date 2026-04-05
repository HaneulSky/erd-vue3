<template>
  <ERDModal 
    v-model="isOpen"
    title="Действия с диаграммами"
    @close="closeModal"
  >
    <template #default>
      <ERDButton>Создать новую диаграмму</ERDButton>
      <table>
        <tr v-for="diagram in diagramsList" :key="diagram.id">
          <td>
            {{ diagram.name }}
          </td>
          <td>
            <ERDSelect
              :list="[]"
              :select-id="`${diagram.id}-users-select`"
             />
          </td>
          <td>
            <ERDButton @click="deleteDiagram(diagram.id)">Удалить</ERDButton>
          </td>
        </tr>
      </table>
    </template>
    <template #buttons>
      <ERDButton @click="cancel">Отменить</ERDButton>
      <ERDButton 
        :disabled="isDisabledOpenButton" 
        @click="create"
      >
      Сохранить
    </ERDButton>
    </template>
  </ERDModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ERDModal from '@/shared/ui/ERDModal.vue';
import { useDiagramModalStore } from '../model/useDiagramModalStore';
import { useDiagramStore } from '@/entities/diagram/model/useDiagramStore';
import ERDButton from '@/shared/ui/ERDButton.vue';
import ERDSelect from '@/shared/ui/ERDSelect.vue';

const diagramModalStore = useDiagramModalStore();
const diagramStore = useDiagramStore();

const isOpen = computed({
  get: () => diagramModalStore.isCreateModalOpen,
  set: (value) => diagramModalStore.setCreateModalOpen(value),
});

const isDisabledOpenButton = computed(() => !diagramName.value.trim() || isSaving.value)

const diagramName = ref<string>('');
const isSaving = ref(false);

const closeModal = () => {
  isOpen.value = false;
  diagramName.value = '';
};

const cancel = () => {
  closeModal();
};

const diagramsList = computed(() => diagramStore.diagrams)

const deleteDiagram = async(id:number) => await diagramStore.deleteDiagram(id)

const create = async () => {
  isSaving.value = true;
  if (!diagramName.value.trim()) return;
  try {
    await diagramStore.createDiagram({name: diagramName.value});
    closeModal();
  } catch(e){
    console.error(e)
  } finally {
    isSaving.value = false
  }
};
</script>