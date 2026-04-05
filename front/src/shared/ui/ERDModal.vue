<template>
  <Teleport to="body">
    <div v-if="modelValue" class="app-modal__overlay" @click="close">
      <div 
        ref="dialogRef"
        class="app-modal"
        @click.stop
      >
        <div class="app-modal__header">
          <h2 class="app-modal__title">{{ title }}</h2>
          <button class="app-modal__close" aria-label="Закрыть" @click="close">
            ✕
          </button>
        </div>
        
        <div class="app-modal__content">
          <slot name="default" />
        </div>
        
        <div class="app-modal__footer">
          <slot name="buttons" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

const close = () => {
  emit('update:modelValue', false);
};

</script>

<style scoped>
.app-modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.app-modal {
  width: 400px;
  max-width: 90%;
  max-height: 90vh;
  border: 1px solid #dadada;
  border-radius: 8px;
  padding: 0;
  margin: 0;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.app-modal__header {
  height: 50px;
  border-bottom: 1px solid #dadada;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.app-modal__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.app-modal__close {
  cursor: pointer;
  font-size: 20px;
  color: #666;
  transition: color 0.2s;
  flex-shrink: 0;
}

.app-modal__close:hover {
  color: #333;
}

.app-modal__content {
  padding: 20px 15px;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.app-modal__footer {
  padding: 15px;
  border-top: 1px solid #dadada;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.app-modal::backdrop {
  background: transparent;
}
</style>