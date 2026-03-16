<template>
  <div class="relations-tab-container">
    <div class="relations-tab-head">
      <!-- TODO здесь селект -->
       <ERDInput 
        v-model="search"
        type="search"
        placeholder="Поиск"
        class="relations-search-input"
       />
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
          @create:field="$emit('create:field', $event)"
        />
      </details>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import TabsRelationBlock from './TabsRelationBlock.vue';
import type { Entity, Datatype, Relation } from '@/features/erd/types/Table.model'
import ERDInput from '@/shared/ui/ERDInput.vue';

const props = defineProps<{
  relations: Relation[];
  tables: Entity[];
  editRelation: Partial<Relation>;
  datatypes: Datatype[];
}>();

const emit = defineEmits<{
  (e: 'update:relation' | 'create:relation', value: Relation): void;
  (e: 'create:relation', value: Pick<Relation, 'id' | 'datatype'>): void;
  (e: 'delete:relation', value: { relation: string | number }): void;
  (e: 'create:field', value: {table: string| number, name: string, datatype: string}): void;
}>();

const search = ref<string | null>(null);

const localValue = computed(() => {
  if(search.value) return props.relations.filter(rel => 
    rel.source?.name?.toLowerCase().includes(search.value) || 
    rel.target?.name?.toLowerCase().includes(search.value) ||
    rel.datatype?.name?.toLowerCase().includes(search.value)
  )
  return props.relations
})

const addNewRelation = () => {
  emit('create:relation', {
    id: `new-${localValue.value.length + 1}`,
    datatype: props.datatypes[0] || {id: 1, name: 'OtO'},
  })
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