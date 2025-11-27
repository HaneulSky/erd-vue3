<template>
  <div class="erd-container">
    <Toolbar 
      :tables="tables"
      :relations="relations" 
      :edit-table-id="editableTableId"
      :datatypes="datatypes"
      @edit:table="$emit('edit-table', $event)"
      @edit:relation="$emit('edit-relation', $event)"
      @delete:relation="$emit('delete:relation', $event)"
      @create:table="$emit('create:table')"
      @update:table="$emit('update:table', $event)"
      @delete:table="$emit('delete:table', $event)"
      @create:field="$emit('create:field', $event)"
    />
    <SvgCanvas 
      :tables="props.tables"
      :relations="props.relations"
      :fields-name="props.fieldsName"
      @drag-table="$emit('drag-table', $event)"
      @edit:table="editableTableId=$event"
      @update:table="$emit('update:table', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Toolbar from './Toolbar.vue';
import SvgCanvas from './SvgCanvas.vue';
import type { Entity, Relation, Datatype } from '../models/Table.model'

interface Props {
  tables: Entity[]
  relations: Relation[]
  datatypes: Datatype[]
  fieldsName: string
}

const props = withDefaults(defineProps<Props>(), {
  fieldsName: 'fields'
})

const emit = defineEmits<{
  (e: 'edit-table', id: string | number): void;
  (e: 'edit-relation', id: string | number): void;
  (e: 'delete:relation', value: { relation: string | number }): void;
  (e: 'create:table'): void;
  (e: 'update:table', value: Entity): void;
  (e: 'delete:table', value: { table: string | number }): void;
  (e: 'create:field', value: { table: string | number }): void;
  (e: 'drag-table', value: any): void;
}>();

const editableTableId = ref<string | number | null>(null);
</script>
<style scoped>
.erd-container {
  height: 100vh;
  display: grid;
  grid-template-columns: 25% 75%;
  width: 100%;
  overflow: hidden;
}
</style>