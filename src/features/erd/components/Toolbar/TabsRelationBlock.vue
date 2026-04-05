<template>
  <div class="relation-block">
    <div class="relation-block-head">
      <span>Имя:</span><span>{{ relationName }}</span>
    </div>

    <div class="relation-block-two-cols">
      <ERDSelect
        select-id="from-select"
        v-model="localValue.source"
        name="tableFrom"
        :list="tables"
        key-prefix="from-"
        return-object
        label="-- Выберите таблицу --"
        @change="createFields"
      />

      <ERDSelect
        select-id="to-select"
        v-model="localValue.target"
        name="tableTo"
        :list="tables"
        key-prefix="to-"
        return-object
        label="-- Выберите таблицу --"
        @change="createFields"
      />
    </div>
    <div class="relation-types">
      <label for="relation-types-select">Тип связи: </label>
      <ERDSelect
        select-id="relation-types-select"
        v-model="localValue.datatype"
        name="relationType"
        :list="datatypes"
        key-prefix="type-"
        label="-- Выберите тип --"
        return-object
        @change="createFields"
      />
    </div>
    <div class="relation-block-two-cols">
      <ERDSelect
        select-id="from-field"
        v-model="localValue.sourceField"
        name="fieldFrom"
        :disabled="!localValue.source"
        :list="localValue.source?.fields"
        key-prefix="first-"
        label="-- Выберите поле --"
        return-object
      />

      <ERDSelect
        select-id="to-field"
        v-model="localValue.targetField"
        name="fieldTo"
        :disabled="!localValue.target"
        :list="localValue.target?.fields"
        key-prefix="second-"
        label="-- Выберите поле --"
        return-object
      />
    </div>
    <ERDButton @click="$emit('delete:relation', { relation: relation.id })">Удалить связь</ERDButton>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { RelationToRelation } from '@/features/erd/types/Table.model';
  import type { Entity, Datatype, Relation } from '@/features/erd/types/Table.model';
  import ERDButton from '@/shared/ui/ERDButton.vue';
  import ERDSelect from '@/shared/ui/ERDSelect.vue';

  const props = defineProps<{
    relation: Relation;
    tables: Entity[];
    datatypes: Datatype[];
  }>();

  const emit = defineEmits<{
    (e: 'update:relation', value: Relation): void;
    (e: 'delete:relation', value: { relation: string | number }): void;
    (e: 'create:field', value: { table: string | number; name: string; datatype: string }): void;
  }>();

  const localValue = ref<Nullable<Relation>>({
      id: null,
      source: null,
      target: null,
      datatype: null,
      sourceField: null,
      targetField: null,
      type: null,
      from: null,
      to: null,
  });

  const relationName = computed(() => {
    return `${localValue.value.source?.name || '(from)'} (${localValue.value.datatype?.name || 'type'}) ${localValue.value.target?.name || '(to)'}`;
  });

  const createFields = () => {
    if (!localValue.value.source || !localValue.value.target || !localValue.value.datatype) return;
    const targetFieldName = localValue.value.target.name || 'noname';
    const sourceFieldName = localValue.value.source.name || 'noname';
    const datatypeName = localValue.value.datatype.name;
    emit('create:field', {
      table: localValue.value.source.id,
      name: targetFieldName.toLowerCase(),
      datatype: datatypeName,
    });
    emit('create:field', {
      table: localValue.value.target.id,
      name: sourceFieldName.toLowerCase(),
      datatype: RelationToRelation[datatypeName],
    });
  };

  const isValidRelation = (value: Nullable<Relation>): value is Relation => {
    return (
      value.id !== null &&
      value.source !== null &&
      value.target !== null &&
      value.datatype !== null &&
      value.sourceField !== null &&
      value.targetField !== null
    );
  }

  watch(
    () => props.relation,
    (value) => {
      localValue.value = value;
    },
    { immediate: true, deep: true }
  );

  watch(
    localValue,
    (value) => {
      if (isValidRelation(value)) {
        emit('update:relation', value);
      }
    },
    { deep: true }
  );
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
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
