<template>
  <div
    ref="svgCanvasBlock"
    class="canvas-container"
    @mousemove="handleDrag"
    @mouseup="stopDrag"
    @wheel.prevent="handleWheel"
  >
    <div class="scale-value">
      <button
        :disabled="scale===maxScale"
        @click="onScaleButton('plus')"
      >
        +
      </button>
      {{ `${Math.round(100 * scale)}%` }}
      <button
        :disabled="scale===minScale"
        @click="onScaleButton('minus')"
      >
        -
      </button>
    </div>
    <svg
      v-if="viewBox.width"
      ref="svgCanvas"
      :viewBox="viewBoxValue"
      @mousedown="handleSvgMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="endPan"
      @mouseleave="endPan"
    >
      <!-- Паттерн с трансформацией с точками для фона -->
      <pattern
        id="bg-pattern"
        patternUnits="userSpaceOnUse"
        :width="15 * scale"
        :height="15 * scale"
        :patternTransform="`translate(${viewBox.x % 15},${viewBox.y % 15})`"
      >
        <circle
          cx="7.5"
          cy="7.5"
          r="1"
          fill="#dadada"
        />
      </pattern>

      <!-- Фоновая заливка -->
      <rect
        :x="viewBox.x - 1000"
        :y="viewBox.y - 1000"
        :width="viewBox.width + 1000"
        :height="viewBox.height + 1000"
        fill="url(#bg-pattern)"
        pointer-events="none"
      />

      <defs>
        <!-- Маркер для "Многие" (M) справа -->
        <marker
          id="arrowhead-many"
          markerWidth="16"
          markerHeight="16"
          refX="15"
          refY="8.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M1 17L17 8.5M17 8.5L1 1M17 8.5H1"
            stroke="#888A90"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </marker>

        <!-- Маркер для "Многие" (M) слева -->
        <marker
          id="arrowhead-many-left"
          markerWidth="16"
          markerHeight="16"
          refX="15"
          refY="8.5"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path
            d="M1 17L17 8.5M17 8.5L1 1M17 8.5H1"
            stroke="#888A90"
            stroke-linejoin="round"
            stroke-width="1.5"
            transform="rotate(180 9 8.5)"
          />
        </marker>

        <!-- Маркер для "Один" (O) -->
        <marker
          id="crossbar-one"
          markerWidth="16"
          markerHeight="16"
          refX="15"
          refY="8"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M16 8H0M8 16L8 0"
            stroke="#888A90"
            stroke-linejoin="round"
            :stroke-width="1.5"
          />
        </marker>
      </defs>

      <!-- Связи -->
      <g class="connections">
        <path
          v-for="relation in relationsData"
          :key="relation.id"
          :d="getConnectionPath(relation)"
          stroke="#888A90"
          :stroke-width="1.5"
          fill="none"
          :marker-start="getMarkerStart(relation)"
          :marker-end="getMarkerEnd(relation)"
          @dblclick="$emit('edit:relation', relation.id)"
        />
      </g>

      <!-- Объекты таблиц -->
      <foreignObject
        v-for="table in tables"
        :key="table.id"
        :x="dragData?.activeItem?.id === table.id ? dragData.activeItem.xAxis || 1 : (table.xAxis || 1)"
        :y="dragData?.activeItem?.id === table.id ? dragData.activeItem.yAxis || 1 : (table.yAxis || 1)"
        :width="tableWidth"
        :height="getBlockHeight(table)"
        @mousedown="startDrag(table, $event)"
      >
        <CanvasBlock
          :table-data="table"
          :fields-name="props.fieldsName"
          @mousedown.native.stop="handleTableMouseDown(table, $event)"
          @edit:table="$emit('edit:table', $event)"
          @edit:field="$emit('edit:field', $event)"
        />
      </foreignObject>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import CanvasBlock from './CanvasBlock.vue';
import type { Entity, Datatype, Relation, Field } from '../models/Table.model'

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Panning {
  isPanning: boolean;
  startX: number;
  startY: number;
  startViewBoxX: number;
  startViewBoxY: number;
}

interface DragData {
  isDragging: boolean;
  activeItem: Entity | null;
  offsetX: number;
  offsetY: number;
  type: string | null;
}

const props = defineProps<{
  tables: Entity[];
  relations: Relation[];
  localStorageName: string;
  fieldsName: string;
}>();

const emit = defineEmits<{
  (e: 'drag-table', value: any): void;
  (e: 'edit:table', id: string | number): void;
  (e: 'update:table', value: Entity): void;
  (e: 'edit:relation', id: string | number): void;
  (e: 'edit:field', value: any): void;
}>();

const scale = ref<number>(1);
const minScale = ref<number>(0.5);
const maxScale = ref<number>(4);
const originalSizes = ref<{ width: number; height: number }>({ width: 0, height: 0 });
const viewBox = ref<ViewBox>({ x: -300, y: -300, width: 0, height: 0 });
const panning = ref<Panning>({
  isPanning: false,
  startX: 0,
  startY: 0,
  startViewBoxX: 0,
  startViewBoxY: 0,
});
const dragData = ref<DragData>({
  isDragging: false,
  activeItem: null,
  offsetX: 0,
  offsetY: 0,
  type: null,
});
const observer = ref<ResizeObserver | null>(null);
const bgUpdateRequested = ref<boolean>(false);
const tableWidth = ref<number>(200);
const relationsData = ref<Relation[]>([]);

const viewBoxValue = computed(() => {
  return `${viewBox.value.x} ${viewBox.value.y} ${viewBox.value.width} ${viewBox.value.height}`;
});

watch(() => props.relations, () => {
  relationsData.value = JSON.parse(JSON.stringify(props.relations));
}, { immediate: true, deep: true });

const getBlockHeight = (table: Entity): number => {
  const headerHeight = 40;
  const fieldHeight = 40;
  const fieldsCount = table.fields?.length || 0;
  return headerHeight + fieldsCount * fieldHeight;
};

const getTablesByRelations = (relation: Relation): { sourceTable: Entity | undefined; targetTable: Table | undefined } => {
  const sourceTable = props.tables.find((t) => t.id === relation.source?.id);
  const targetTable = props.tables.find((t) => t.id === relation.target?.id);
  return { sourceTable, targetTable };
};

const getMarkerStart = (relation: Relation): string => {
  const datatype = relation.datatype?.name;
  if (datatype === 'OtO' || datatype === 'MtO') return 'url(#crossbar-one)';
  if (datatype === 'MtM' || datatype === 'OtM') return 'url(#arrowhead-many-left)';
  return '';
};

const getMarkerEnd = (relation: Relation): string => {
  const datatype = relation.datatype?.name;
  if (datatype === 'OtO' || datatype === 'OtM') return 'url(#crossbar-one)';
  if (datatype === 'MtM' || datatype === 'MtO') return 'url(#arrowhead-many)';
  return '';
};

const getConnectionPoint = (table: Entity, side: string, relation: Relation, isSource: boolean): { x: number; y: number } => {
  const visualTableWidth = tableWidth.value;
  const visualHeaderHeight = 40;
  const fieldHeight = 40;
  const baseX = table.xAxis || 1;
  const baseY = table.yAxis || 1;
  let yPosition: number;
  const fieldName = isSource ? relation.sourceField?.name : relation.targetField?.name;
  const field = table.fields?.find(f => f.name === fieldName);
  if (field) {
    const fieldIndex = table.fields?.findIndex(f => f.name === fieldName) || 0;
    yPosition = baseY + visualHeaderHeight + fieldIndex * fieldHeight + fieldHeight / 2;
  } else {
    yPosition = baseY + visualHeaderHeight / 2;
  }
  const offset = 2;
  switch (side) {
    case 'left':
      return { x: baseX - offset, y: yPosition };
    case 'right':
      return { x: baseX + visualTableWidth + offset, y: yPosition };
    default:
      return { x: baseX + visualTableWidth / 2, y: yPosition };
  }
};

const getConnectionPath = (relation: Relation): string => {
  const { sourceTable, targetTable } = getTablesByRelations(relation);
  if (!sourceTable || !targetTable) return '';
  const visualTableWidth = tableWidth.value;
  const isSameXAxis = Math.abs(sourceTable.xAxis! - targetTable.xAxis!) <= visualTableWidth;
  const isSourceAbove = sourceTable.yAxis! < targetTable.yAxis!;
  const sourceVisualCenterX = sourceTable.xAxis! + visualTableWidth / 2;
  const targetVisualCenterX = targetTable.xAxis! + visualTableWidth / 2;
  const isSourceLeft = sourceVisualCenterX < targetVisualCenterX;
  const baseRadius = 5;

  if (isSameXAxis) {
    const side = isSourceAbove ? 'right' : 'right';
    const offset = 35;
    const topTable = isSourceAbove ? sourceTable : targetTable;
    const bottomTable = isSourceAbove ? targetTable : sourceTable;
    const topPoint = getConnectionPoint(topTable, side, relation, topTable.id === relation.source?.id);
    const bottomPoint = getConnectionPoint(bottomTable, side, relation, bottomTable.id === relation.source?.id);
    const midX = Math.max(topTable.xAxis! + visualTableWidth, bottomTable.xAxis! + visualTableWidth) + offset;
    if (relation.datatype?.name === 'OtO' || (relation.datatype?.name === 'MtO' && !isSourceAbove) || (relation.datatype?.name === 'OtM' && isSourceAbove)) topPoint.x += 15;
    const yDistance = Math.abs(bottomTable.yAxis! - topPoint.y);
    const radius = Math.min(baseRadius, yDistance / 2);
    const path = `
      M ${topPoint.x},${topPoint.y}
      L ${midX - radius},${topPoint.y}
      Q ${midX},${topPoint.y} ${midX},${topPoint.y + (bottomPoint.y > topPoint.y ? radius : -radius)}
      L ${midX},${bottomPoint.y - (bottomPoint.y > topPoint.y ? radius : -radius)}
      Q ${midX},${bottomPoint.y} ${bottomPoint.x},${bottomPoint.y}`;
    return path.trim();
  }

  const sourceSide = isSourceLeft ? 'right' : 'left';
  const targetSide = isSourceLeft ? 'left' : 'right';
  const start = getConnectionPoint(sourceTable, sourceSide, relation, true);
  const end = getConnectionPoint(targetTable, targetSide, relation, false);
  const midX = (start.x + end.x) / 2;

  if ((relation.datatype?.name === 'OtO' || relation.datatype?.name === 'OtM') && targetSide === 'left') start.x += 15;
  if ((relation.datatype?.name === 'OtO' || relation.datatype?.name === 'OtM') && targetSide === 'right') start.x -= 15;
  if (start.y === end.y) {
    return `
      M ${start.x},${start.y}
      L ${end.x},${end.y}`;
  }

  const yDistance = Math.abs(end.y - start.y);
  const radius = Math.min(baseRadius, yDistance / 2);
  const path = isSourceLeft
    ? `M ${start.x},${start.y}
       L ${midX - radius},${start.y}
       Q ${midX},${start.y} ${midX},${start.y + (end.y > start.y ? radius : -radius)}
       L ${midX},${end.y - (end.y > start.y ? radius : -radius)}
       Q ${midX},${end.y} ${midX + (end.x > midX ? radius : -radius)},${end.y}
       L ${end.x},${end.y}`
    : `M ${start.x},${start.y}
       L ${midX + radius},${start.y}
       Q ${midX},${start.y} ${midX},${start.y + (end.y > start.y ? radius : -radius)}
       L ${midX},${end.y - (end.y > start.y ? radius : -radius)}
       Q ${midX},${end.y} ${midX + (end.x > midX ? radius : -radius)},${end.y}
       L ${end.x},${end.y}`;
  return path.trim();
};

const handleDrag = (event: MouseEvent) => {
  if (dragData.value.isDragging && dragData.value.activeItem) {
    const newX = event.clientX - dragData.value.offsetX;
    const newY = event.clientY - dragData.value.offsetY;
    dragData.value.activeItem.xAxis = newX / scale.value + viewBox.value.x;
    dragData.value.activeItem.yAxis = newY / scale.value + viewBox.value.y;
    emit('drag-table', dragData.value.activeItem);
  }
};

const stopDrag = () => {
  console.log('dragData.value', dragData.value)
  if (dragData.value.isDragging) {
    emit('update:table', dragData.value.activeItem);
    dragData.value.isDragging = false;
    dragData.value.activeItem = null;
  }
};

const handleWheel = (event: WheelEvent) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  const newScale = Math.min(maxScale.value, Math.max(minScale.value, scale.value + delta));
  if (newScale !== scale.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const newWidth = originalSizes.value.width / newScale;
    const newHeight = originalSizes.value.height / newScale;
    const ratioX = mouseX / rect.width;
    const ratioY = mouseY / rect.height;
    viewBox.value.x += (viewBox.value.width - newWidth) * ratioX;
    viewBox.value.y += (viewBox.value.height - newHeight) * ratioY;
    viewBox.value.width = newWidth;
    viewBox.value.height = newHeight;
    scale.value = newScale;
    localStorage.setItem(`${props.localStorageName}-scale`, scale.value.toString());
    localStorage.setItem(`${props.localStorageName}-viewBox`, JSON.stringify(viewBox.value));
  }
};

const onScaleButton = (type: 'plus' | 'minus') => {
  const delta = type === 'plus' ? 0.1 : -0.1;
  const newScale = Math.min(maxScale.value, Math.max(minScale.value, scale.value + delta));
  if (newScale !== scale.value) {
    const rect = (svgCanvasBlock.value as HTMLElement).getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newWidth = originalSizes.value.width / newScale;
    const newHeight = originalSizes.value.height / newScale;
    viewBox.value.x += (viewBox.value.width - newWidth) / 2;
    viewBox.value.y += (viewBox.value.height - newHeight) / 2;
    viewBox.value.width = newWidth;
    viewBox.value.height = newHeight;
    scale.value = newScale;
    localStorage.setItem(`${props.localStorageName}-scale`, scale.value.toString());
    localStorage.setItem(`${props.localStorageName}-viewBox`, JSON.stringify(viewBox.value));
  }
};

const handleSvgMouseDown = (event: MouseEvent) => {
  panning.value.isPanning = true;
  panning.value.startX = event.clientX;
  panning.value.startY = event.clientY;
  panning.value.startViewBoxX = viewBox.value.x;
  panning.value.startViewBoxY = viewBox.value.y;
};

const handleMouseMove = (event: MouseEvent) => {
  if (panning.value.isPanning) {
    const dx = (event.clientX - panning.value.startX) / scale.value;
    const dy = (event.clientY - panning.value.startY) / scale.value;
    viewBox.value.x = panning.value.startViewBoxX - dx;
    viewBox.value.y = panning.value.startViewBoxY - dy;
    localStorage.setItem(`${props.localStorageName}-viewBox`, JSON.stringify(viewBox.value));
  }
};

const endPan = () => {
  panning.value.isPanning = false;
};

const startDrag = (table: Entity, event: MouseEvent) => {
  dragData.value.isDragging = true;
  dragData.value.activeItem = { ...table };
  dragData.value.offsetX = event.clientX - (table.xAxis! * scale.value - viewBox.value.x * scale.value);
  dragData.value.offsetY = event.clientY - (table.yAxis! * scale.value - viewBox.value.y * scale.value);
  dragData.value.type = 'table';
};

const handleTableMouseDown = (table: Entity, event: MouseEvent) => {
  event.stopPropagation();
  startDrag(table, event);
};

const svgCanvasBlock = ref<HTMLElement | null>(null);
const svgCanvas = ref<SVGSVGElement | null>(null);

onMounted(() => {
  const savedScale = localStorage.getItem(`${props.localStorageName}-scale`);
  const savedViewBox = localStorage.getItem(`${props.localStorageName}-viewBox`);
  if (savedViewBox) viewBox.value = JSON.parse(savedViewBox);
  if (savedScale && !isNaN(Number(savedScale))) scale.value = Math.min(maxScale.value, Math.max(minScale.value, Number(savedScale)));
  if (svgCanvasBlock.value) {
    observer.value = new ResizeObserver(() => {
      const rect = svgCanvasBlock.value!.getBoundingClientRect();
      originalSizes.value.width = rect.width;
      originalSizes.value.height = rect.height;
      viewBox.value.width = rect.width / scale.value;
      viewBox.value.height = rect.height / scale.value;
      localStorage.setItem(`${props.localStorageName}-viewBox`, JSON.stringify(viewBox.value));
    });
    observer.value.observe(svgCanvasBlock.value);
  }
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});
</script>
<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  cursor: grab;
  position: relative;
  contain: strict;
  transform: translateZ(0);
  will-change: transform;
  background: #fffdfd;
  z-index: 2;
  border: 1px solid #dadada;
  scroll-behavior: smooth;
}

.canvas-container:active {
  cursor: grabbing;
}

.scale-value {
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  top: 0;
  right: 2px;
  min-width: 100px;
  max-width: 100px;
  padding: 0 2px;
  height: 20px;
  background: #dadada;
  z-index: 3;
  cursor: pointer;
  font-size: 14px;
}

svg {
  display: block;
  height: 100%;
  width: 100%;
  touch-action: none;
  user-select: none;
  overflow: auto;
}

foreignObject {
  transform-origin: 0 0;
  pointer-events: auto;
  will-change: transform;
  cursor: move;
}

pattern circle {
  shape-rendering: crispEdges;
}

.connections path {
  cursor: pointer;
  pointer-events: stroke;
  transition: d 0.3s ease-out;
}

.connections path:hover {
  stroke: blue;
  box-shadow: 0 0 1px 1px #dadada;
}

button {
  width: 17px;
  height: 17px;
  font-size: 15px;
  padding: 0;
  background: none;
  border: none;
  z-index: 1;
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  .connections path {
    transition: none;
  }
}
</style>