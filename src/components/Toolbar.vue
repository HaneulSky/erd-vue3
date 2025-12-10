<template>
  <div class="erd-toolbar">
    <div class="tabs">
      <button 
        class="tab"
        :class="{'current': currentTab === 0}"
        @click="openTab('tables')"
      >
        Таблицы
      </button>
      <button 
        class="tab"
        :class="{'current': currentTab === 1}"
        @click="openTab('relations')"
      >
        Связи 
      </button>
    </div>
    <div class="tabs-container">
      <EntityTab
        v-show="currentTab === 0"
        :tables="tables"
        :edit-table-id="editTableId"
        :datatypes="notRelationDatatypes"
        @create:table="$emit('create:table')"
        @update:table="$emit('update:table', $event)"
        @delete:table="$emit('delete:table', $event)"
        @create:field="$emit('create:field', $event)"
        @update:field="$emit('update:field', $event)"
      />
      <RelationTab
        v-show="currentTab === 1"
        :relations="relations"
        :tables="tables"
        :datatypes="relationDatatypes"
        @create:relation="$emit('create:relation', $event)"
        @update:relation="$emit('update:relation', $event)"
        @delete:relation="$emit('delete:relation', $event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import EntityTab from './EntityTab.vue';
import RelationTab from './RelationTab.vue';
import type { Entity, Datatype, Relation } from '../models/Table.model'

const props = defineProps<{
  tables: Entity[];
  relations: Relation[];
  editTableId: string | number | null;
  datatypes: Datatype[];
}>();

const emit = defineEmits<{
  (e: 'create:table'): void;
  (e: 'update:table', value: Entity): void;
  (e: 'delete:table', value: { table: string | number }): void;
  (e: 'create:field', value: { table: string | number }): void;
  (e: 'update:field', value: { table: string | number, id: number, name: string }): void;
  (e: 'create:relation', value: Relation): void;
  (e: 'update:relation', value: Relation): void;
  (e: 'delete:relation', value: { relation: string | number }): void;
}>();

const currentTab = ref<number>(0);

const relationDatatypes = computed(() => {
  return props.datatypes.filter((type) => ['OtO', 'MtM', 'MtO', 'OtM'].includes(type.name));
});

const notRelationDatatypes = computed(() => {
  return props.datatypes.filter((type) => !['OtO', 'MtM', 'MtO', 'OtM'].includes(type.name));
});

const openTab = (tabName: string) => {
  if (tabName === 'tables') currentTab.value = 0;
  if (tabName === 'relations') currentTab.value = 1;
};
</script>
<style scoped>
.erd-toolbar {
  background-color: rgb(242, 226, 250, 0.3);
  border: 1px solid #dadada;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tabs {
  height: 45px;
  display: grid;
  grid-template-columns: 50% 50%;
}

.tab {
  cursor: pointer;
  border: none;
  background: none;
  border-bottom: 3px solid;
  border-bottom-color: white;
  transition: background .5s ease-in-out, border-bottom-color .5s ease;
}

.tab.current {
  border-bottom-color: rgb(126, 126, 238);
}

.tab:hover {
  background: rgb(233, 250, 255);
  border-bottom-color: #dadada;
}

.tabs-container {
  overflow: auto;
  max-height: calc(100vh - 75px);
  position: relative;
  padding: 10px;
}
</style>