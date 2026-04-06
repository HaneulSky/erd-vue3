<template>
  <foreignObject
    v-for="table in props.tables"
    :key="table.id"
    :x="getObjectX(table)"
    :y="getObjectY(table)"
    :width="props.tableWidth"
    :height="getBlockHeight(table)"
    @mousedown="startDrag(table, $event)"
  >
    <CanvasBlock
      :table-data="table"
      :fields-name="props.fieldsName"
      @mousedown.stop="handleTableMouseDown(table, $event)"
      @edit:table="$emit('edit:table', $event)"
      @update:field="$emit('update:field', $event)"
    />
  </foreignObject>
</template>
<script setup lang="ts">
  import type { Entity } from '@/features/erd/types/Table.model';
  import CanvasBlock from './CanvasBlock.vue';

  // TODO повторяшка
  interface DragData {
    isDragging: boolean;
    activeItem: Entity | null;
    offsetX: number;
    offsetY: number;
    type: string | null;
  }

  interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  const props = defineProps<{
    tables: Entity[];
    tableWidth: number;
    fieldsName: string;
    scale: number;
    viewBox: ViewBox;
    dragData: DragData;
  }>();

  const emit = defineEmits<{
    (e: 'edit:table', id: string | number): void;
    (e: 'update:field', value: unknown): void;
    (e: 'start-drag', value: Dragdata): void;
  }>();

  const getObjectX = (table: Entity) =>
    props.dragData?.activeItem?.id === table.id
      ? props.dragData.activeItem.xAxis || 1
      : table.xAxis || 1;
  const getObjectY = (table: Entity) =>
    props.dragData?.activeItem?.id === table.id
      ? props.dragData.activeItem.yAxis || 1
      : table.yAxis || 1;

  const getBlockHeight = (table: Entity): number => {
    const headerHeight = 40;
    const fieldHeight = 40;
    const border = 4;
    const fieldsCount = table.fields?.length || 0;

    return headerHeight + fieldsCount * fieldHeight + border;
  };

  const startDrag = (table: Entity, event: MouseEvent) => {
    const dragDataLocal = props.dragData;

    dragDataLocal.isDragging = true;
    dragDataLocal.activeItem = { ...table };
    dragDataLocal.offsetX =
      event.clientX - (table.xAxis! * props.scale - props.viewBox.x * props.scale);
    dragDataLocal.offsetY =
      event.clientY - (table.yAxis! * props.scale - props.viewBox.y * props.scale);
    dragDataLocal.type = 'table';

    emit('start-drag', dragDataLocal);
  };

  const handleTableMouseDown = (table: Entity, event: MouseEvent) => {
    event.stopPropagation();
    startDrag(table, event);
  };
</script>
<style scoped>
  foreignObject {
    transform-origin: 0 0;
    pointer-events: auto;
    will-change: transform;
    cursor: move;
  }
</style>
