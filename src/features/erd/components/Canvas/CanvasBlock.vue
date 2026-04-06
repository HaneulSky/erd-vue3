<template>
  <div
    class="table-block"
    @mousedown="$emit('mousedown', $event)"
  >
    <div class="table-block-header table-block-row">
      <span>{{ tableData.name }}</span>
      <ERDButton
        class="material-icons"
        @click="$emit('edit:table', tableData.id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 18h4.24a1 1 0 0 0 .71-.29l6.92-6.93L19.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71V17a1 1 0 0 0 1 1m9.76-13.59l2.83 2.83l-1.42 1.42l-2.83-2.83ZM6 13.17l5.93-5.93l2.83 2.83L8.83 16H6ZM21 20H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2"
          />
        </svg>
      </ERDButton>
    </div>
    <div
      v-if="props.tableData[props.fieldsName]"
      class="table-block-data"
    >
      <div
        v-for="field in props.tableData[props.fieldsName]"
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
  import type { Entity } from '@/features/erd/types/Table.model';
  import ERDButton from '@/shared/ui/ERDButton.vue';

  const props = defineProps<{
    tableData: Entity;
    fieldsName: string;
  }>();

  defineEmits<{
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
    border-radius: 5px;
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
