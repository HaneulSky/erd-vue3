<template>
  <div class="tables-tab-container">
    <div class="tables-tab-head">
      <form class="select-wrapper">
        <ERDSelect
          v-model="search"
          :disabled="!tables.length"
          name="entity"
          select-id="entity-select"
          class="tables-search-input"
          :list="tables"
        />

        <button
          v-if="search !== null"
          type="button"
          class="clear-btn"
          @click="search = null"
        >
          ✕
        </button>
      </form>

      <ERDButton
        class="add-table-btn"
        @click="$emit('create:table')"
      >
        Добавить таблицу
      </ERDButton>
    </div>
    <div
      v-if="tables.length"
      class="tables-tab-tables"
    >
      <details
        v-for="table in searched"
        :key="table.id"
        :open="editTableId === table.id"
      >
        <summary>{{ table.name || 'таблица' }}</summary>
        <TabsEntityBlock
          :table="table"
          @create:field="$emit('create:field', $event)"
          @update:field="$emit('update:field', $event)"
          @update:table="$emit('update:table', $event)"
          @delete:table="$emit('delete:table', $event)"
        />
      </details>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Entity, Datatype } from '@/features/erd/types/Table.model';

  import TabsEntityBlock from './TabsEntityBlock.vue';
  import ERDSelect from '@/shared/ui/ERDSelect.vue';
  import ERDButton from '@/shared/ui/ERDButton.vue';

  const props = defineProps<{
    tables: Entity[];
    editTableId: string | number | null;
    datatypes: Datatype[];
  }>();

  defineEmits<{
    (e: 'create:table'): void;
    (e: 'create:field', value: { table: string | number }): void;
    (e: 'update:field', value: { table: string | number; id: number; name: string }): void;
    (e: 'update:table', value: Entity): void;
    (e: 'delete:table', value: { table: string | number }): void;
  }>();

  const search = ref(null);

  const searched = computed<Entity[] | undefined>(() => {
    if (search.value) return props.tables.filter((t) => t.id === search.value);

    return props.tables;
  });
</script>
<style scoped>
  .tables-tab-container {
    max-height: 100%;
  }

  .tables-tab-head {
    display: grid;
    grid-template-columns: 1fr 80px;
    gap: 10px;
    width: 100%;
    margin-bottom: 25px;
    position: sticky;
    top: 0;
  }

  .tables-tab-tables {
    height: 100%;
  }

  .add-table-btn {
    min-height: 36px;
    max-width: 80px;
  }

  .tables-search-input {
    width: 100%;
    min-height: 36px;
  }

  .select-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .clear-btn {
    margin-left: 6px;
    cursor: pointer;
    padding: 2px 6px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
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
    margin-bottom: none;
  }
</style>
