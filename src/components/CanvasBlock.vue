<template>
  <div
    class="table-block"
    @mousedown="$emit('mousedown', $event)"
  >
    <div class="table-block-header table-block-row">
      <span>{{ tableData.name }}</span>
      <button 
        class="material-icons"
        @click="$emit('edit:table', tableData.id)"
      >
        edit
      </button>
    </div>
    <div
      v-if="tableData[fieldsName]"
      class="table-block-data"
    >
      <div
        v-for="field in tableData[fieldsName]"
        :key="field.id"
        class="table-block-data-field table-block-row"
      >
        <span class="table-block-data-field-name">{{ field.name }}</span>
        <span class="table-block-data-field-type">{{ field.datatype?.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Entity } from '../models/Table.model'

const props = defineProps<{
  tableData: Entity;
  fieldsName: string;
}>();

const emit = defineEmits<{
  (e: 'mousedown', event: MouseEvent): void;
  (e: 'edit:table', id: string | number): void;
}>();
</script>
<style scoped>
.table-block {
  width: 100%;
  height: auto;
  border: 1px solid #494949;
  border-radius: 5px;
  box-sizing: border-box;
  background: white;
  cursor: move;
  pointer-events: all;
}

.table-block:hover {
  border: 1px dashed #3f496a;
}

.table-block-row {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}

.table-block-header {
  background: #dadada;
}

button {
  width: 17px;
  height: 17px;
  font-size: 15px;
  padding: 0;
  background: none;
  border: none;
  z-index: 1;
  cursor: pointer;
}

.table-block-data-field {
  border-bottom: 1px solid #494949;
}

.table-block-data-field:last-child {
  border: none;
}

.table-block-data-field-type {
  color: grey;
}
</style>