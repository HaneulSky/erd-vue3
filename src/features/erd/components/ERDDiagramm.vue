<template>
  <div class="erd-container">
    <Toolbar
      :tables="tables"
      :relations="relations"
      :edit-table-id="editableTableId"
      :edit-relation-id="editableRelationId"
      :datatypes="datatypes"
      @edit:table="onEditTable"
      @update:relation="onUpdateRelation"
      @delete:relation="onDeleteRelation"
      @create:relation="onCreateRelation"
      @create:table="onCreateTable"
      @update:table="onUpdateTable"
      @delete:table="onDeleteTable"
      @create:field="onCreateField"
      @update:field="onUpdateField"
    />
    <SVGCanvas
      :tables="props.tables"
      :relations="props.relations"
      :local-storage-name="props.localStorageName"
      @drag-table="onDragTable"
      @edit:table="editableTableId = $event"
      @edit:relation="editableRelationId = $event"
      @update:table="onUpdateTable"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import Toolbar from './Toolbar/ERDToolbar.vue';
  import SVGCanvas from './Canvas/SVGCanvas.vue';
  import type { Entity, Relation, Datatype } from '@/features/erd/types/Table.model';

  interface Props {
    relations: Relation[];
    datatypes: Datatype[];
    localStorageName?: string;
    tables: Entity[];
  }

  interface EmitEvents {
    'edit-table': string | number;
    'update:relation': Relation;
    'create:relation': Pick<Relation, 'id' | 'datatype'>;
    'delete:relation': { relation: string | number };
    'create:table': void;
    'update:table': Entity;
    'delete:table': { table: string | number };
    'create:field': { table: string | number; name?: string; datatype?: string };
    'update:field': { table: string | number; id: number; name: string };
    'drag-table': unknown;
  }

  const props = withDefaults(defineProps<Props>(), {
    localStorageName: 'my-erd',
  });

  const emit = defineEmits<{
    (e: 'edit-table', id: EmitEvents['edit-table']): void;
    (e: 'update:relation', value: EmitEvents['update:relation']): void;
    (e: 'create:relation', value: EmitEvents['create:relation']): void;
    (e: 'delete:relation', value: EmitEvents['delete:relation']): void;
    (e: 'create:table'): void;
    (e: 'update:table', value: EmitEvents['update:table']): void;
    (e: 'delete:table', value: EmitEvents['delete:table']): void;
    (e: 'create:field', value: EmitEvents['create:field']): void;
    (e: 'update:field', value: EmitEvents['update:field']): void;
    (e: 'drag-table', value: EmitEvents['drag-table']): void;
  }>();

  const editableTableId = ref<string | number | null>(null);
  const editableRelationId = ref<string | number | null>(null);

  const onEditTable = (id: EmitEvents['edit-table']) => emit('edit-table', id);
  const onUpdateRelation = (value: EmitEvents['update:relation']) => emit('update:relation', value);
  const onDeleteRelation = (value: EmitEvents['delete:relation']) => emit('delete:relation', value);
  const onCreateRelation = (value: EmitEvents['create:relation']) => emit('create:relation', value);
  const onCreateTable = () => emit('create:table');
  const onUpdateTable = (value: EmitEvents['update:table']) => emit('update:table', value);
  const onDeleteTable = (value: EmitEvents['delete:table']) => emit('delete:table', value);
  const onCreateField = (value: EmitEvents['create:field']) => emit('create:field', value);
  const onUpdateField = (value: EmitEvents['update:field']) => emit('update:field', value);
  const onDragTable = (value: unknown) => emit('drag-table', value);
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
