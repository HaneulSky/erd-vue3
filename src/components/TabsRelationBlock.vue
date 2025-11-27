<template>
  <div class="relation-block">
    <div class="relation-block-head">
      <span>Имя:</span><span>{{ relationName }}</span>
    </div>

    <div class="relation-block-two-cols">
      <select
        id="from-select"
        v-model="localValue.source"
        name="tableFrom"
      >
        <option
          value=""
        >
          -- Выберите таблицу --
        </option>
        <option
          v-for="table in tables"
          :key="`from-${table.id}`"
          :value="table"
        >
          {{ table.name }}
        </option>
      </select>

      <select
        id="to-select"
        v-model="localValue.target"
        name="tableTo">
        <option value="">
          -- Выберите таблицу --
        </option>
        <option
          v-for="table in tables"
          :key="`to-${table.id}`"
          :value="table">
          {{ table.name }}
        </option>
      </select>
    </div>
    <div class="relation-types">
      <label for="relation-types-select">Тип связи: </label>
      <select
        id="relation-types-select"
        v-model="localValue.datatype"
        name="relationType"
      >
        <option value="">-- Выберите тип --</option>
        <option
          v-for="type in datatypes"
          :key="`type-${type.id}`"
          :value="type"
        >
          {{ type.name }}
        </option>
      </select> 
    </div>
    <div class="relation-block-two-cols">
      <select
        id="from-field"
        v-model="localValue.sourceField"
        name="fieldFrom"
        :disabled="!localValue.source"
      >
        <option value="">-- Выберите поле --</option>
        <option
          v-for="field in localValue.source?.fields"
          :key="`first-${field?.id}`"
          :value="field"
        >
          {{ field.name }}
        </option>
      </select>

      <select
        id="to-field"
        v-model="localValue.targetField"
        name="fieldTo"
        :disabled="!localValue.target"
      >
        <option value="">
          -- Выберите поле --
        </option>
        <option
          v-for="field in localValue.target?.fields"
          :key="`second-${field?.id}`"
          :value="field"
        >
          {{ field.name }}
        </option>
      </select>
    </div>
    <button
      @click="$emit('delete:relation', { relation: relation.id })"
    >
      Удалить связь
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Entity, Datatype, Relation } from '../models/Table.model'


const props = defineProps<{
  relation: Relation;
  tables: Entity[];
  datatypes: Datatype[];
}>();

const emit = defineEmits<{
  (e: 'update:relation', value: Relation): void;
  (e: 'delete:relation', value: { relation: string | number }): void;
}>();

const localValue = ref<Relation>({});

const relationName = computed(() => {
  return `${localValue.value.source?.name || '(from)'} (${localValue.value.datatype?.name || 'type'}) ${localValue.value.target?.name || '(to)'}`;
});

watch(() => props.relation, (value) => {
  localValue.value = value;
}, { immediate: true, deep: true });

watch(localValue, (value) => {
  if (value.source && value.target && value.datatype && value.sourceField && value.targetField) {
    emit('update:relation', value);
  }
}, { deep: true });
</script>

<style scoped>
.relation-block {
  padding: 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.relation-block-head {
  width: 100%;
  display: grid;
  grid-template-columns: 35px 1fr;
  gap: 10px;
  color: #494949;
  font-size: 18px;
}

.relation-block-two-cols {
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 10px;
}
</style>