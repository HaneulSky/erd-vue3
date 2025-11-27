<template>
  <div class="relations-tab-container">
    <div class="relations-tab-head">
      <!-- TODO здесь селект -->
      <input
        v-model="search"
        type="search"
        placeholder="Поиск"
        class="relations-search-input"
      >
      <button
        class="add-relation-btn"
        @click="addNewRelation">
        Добавить связь
      </button>
    </div>
    <div
      v-if="relations.length"
      class="relations-tab-relations"
    >
      <details 
        v-for="relation in localValue"
        :key="relation?.id" 
        :open="editRelation?.id === relation?.id"
      >
        <summary>{{`${relation.source?.name || '(from)'} (${relation.datatype?.name || 'type'}) ${relation.target?.name || '(to)'}`}}</summary>
        <TabsRelationBlock
          :relation="relation"
          :tables="tables"
          :datatypes="datatypes"
          @update:relation="$emit('update:relation', $event)"
          @delete:relation="$emit('delete:relation', $event)"
        />
      </details>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import TabsRelationBlock from './TabsRelationBlock.vue';
import type { Entity, Datatype, Relation } from '../models/Table.model'

const props = defineProps<{
  relations: Relation[];
  tables: Entity[];
  editRelation: Partial<Relation>;
  datatypes: Datatype[];
}>();

const emit = defineEmits<{
  (e: 'update:relation', value: Relation): void;
  (e: 'delete:relation', value: { relation: string | number }): void;
}>();

const search = ref<string | null>(null);
const localValue = ref<Relation[]>([]);

watch(() => props.relations, () => {
  localValue.value = props.relations;
}, { immediate: true, deep: true });

const addNewRelation = () => {
  localValue.value.push({
    id: `new-${localValue.value.length + 1}`,
    type: null,
    from: null,
    to: null
  });
};
</script>
<style scoped>
.relations-tab-container{
  height: 100%;
}

.relations-tab-head {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  width: 100%;
  margin-bottom: 25px;
  position: sticky;
  top: 0;
  background-color: white;
}

.relations-tab-relations {
  max-height: 100%;
}

.add-relation-btn {
  cursor: pointer;
  border: 1px solid #3f496a;
  min-height: 24px;
}

.relations-search-input {
  width: 100%;
}

summary {
  cursor: pointer;
}

details:open summary {
  border-bottom: 1px dashed #3f496a;
  padding-bottom: 5px;
}

details {
  border: 1px solid #494949;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
}

details:last-child {
  margin-bottom: 0;
}
</style>