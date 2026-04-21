<template>
  <div class="table-block">
    <div class="table-block-head">
      <span>Имя:</span>
      <ERDInput
        :value="table.name"
        @update:model-value="updateTable({ name: ($event.target as HTMLInputElement)?.value })"
      />
    </div>
    <div
      v-for="field in props.table.fields"
      :key="field.id"
    >
      <ERDInput
        :value="field.name"
        @update:model-value="
          $emit('update:field', {
            table: table.id,
            id: field.id,
            name: ($event.target as HTMLInputElement)?.value,
          })
        "
      />
      <span>
        {{ field.type }}
      </span>
    </div>
    <div>
      <details class="comment-collapse">
        <summary>Комментарий</summary>
        <textarea
          :value="props.table.comment"
          @blur="updateTable({ comment: ($event.target as HTMLTextAreaElement).value })"
        />
      </details>
    </div>
    <ERDButton @click="$emit('create:field', { table: table.id })">Добавить поле</ERDButton>
    <ERDButton @click="$emit('delete:table', { table: table.id })">Удалить таблицу</ERDButton>
  </div>
</template>
<script setup lang="ts">
  import type { Entity } from '@/features/erd/types/Table.model';
  import ERDButton from '@/shared/ui/ERDButton.vue';
  import ERDInput from '@/shared/ui/ERDInput.vue';

  const props = defineProps<{
    table: Entity;
  }>();

  const emit = defineEmits<{
    (e: 'create:field', value: { table: string | number }): void;
    (e: 'update:field', value: { table: string | number; id: number; name: string }): void;
    (e: 'update:table', value: Entity): void;
    (e: 'delete:table', value: { table: string | number }): void;
  }>();

  const updateTable = (data: Partial<Entity>): void => {
    emit('update:table', { ...props.table, ...data });
  };
</script>

<style scoped>
  .table-block {
    padding: 15px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .table-block-head {
    width: 100%;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    gap: 5px;
    align-items: center;
  }

  summary {
    cursor: pointer;
  }

  .comment-collapse:open summary {
    padding-bottom: 5px;
  }

  details {
    border: var(--border);
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
  }

  .table-block-head span {
    display: inline-block;
    color: #494949;
    font-size: 18px;
    width: 40px;
  }

  .table-block-head input:focus {
    border-bottom: var(--border);
  }
</style>
