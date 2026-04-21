<template>
  <div
    ref="svgCanvasBlock"
    class="canvas-container"
    @mousemove="handleDrag"
    @mouseup="stopDrag"
    @wheel.prevent="handleWheel"
  >
    <CanvasZoom
      :scale="scale"
      :max-scale="maxScale"
      :min-scale="minScale"
      :local-storage-name="localStorageName"
      :view-box="viewBox"
      :original-sizes="originalSizes"
      @on-scale-button="onScaleButton"
    />
    <svg
      v-if="viewBox.width"
      ref="svgCanvas"
      :viewBox="viewBoxValue"
      @mousedown="handleSvgMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="endPan"
      @mouseleave="endPan"
    >
      <CanvasBackground
        :scale="scale"
        :viewBox="viewBox"
      />
      <CanvasMarkers />

      <CanvasRelations
        :relations="props.relations"
        :tables="props.tables"
        :table-width="tableWidth"
        @edit:relation="$emit('edit:relation', $event)"
      />

      <CanvasTables
        :tables="tables"
        :table-width="tableWidth"
        :fields-name="fieldsName"
        :scale="scale"
        :view-box="viewBox"
        :drag-data="dragData"
        @edit:table="$emit('edit:table', $event)"
        @update:field="$emit('update:field', $event)"
        @start-drag="dragData = $event"
      />
    </svg>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import CanvasBackground from './CanvasBackground.vue';
  import CanvasMarkers from './CanvasMarkers.vue';
  import type { Entity, Relation } from '@/features/erd/types/Table.model';
  import CanvasRelations from './CanvasRelations.vue';
  import CanvasTables from './CanvasTables.vue';
  import CanvasZoom from './CanvasZoom.vue';

  //TODO перенести

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
    fieldsName: keyof Entity;
  }>();

  const emit = defineEmits<{
    (e: 'drag-table', value: unknown): void;
    (e: 'edit:table', id: string | number): void;
    (e: 'update:table', value: Entity): void;
    (e: 'edit:relation', id: string | number): void;
    (e: 'update:field', value: unknown): void;
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
  const tableWidth = ref<number>(200);
  const svgCanvasBlock = ref<HTMLElement | null>(null);

  const viewBoxValue = computed(() => {
    return `${viewBox.value.x} ${viewBox.value.y} ${viewBox.value.width} ${viewBox.value.height}`;
  });

  const onScaleButton = ({
    viewBox: newViewBox,
    scale: newScale,
  }: {
    viewBox: ViewBox;
    scale: number;
  }) => {
    viewBox.value = newViewBox;
    scale.value = newScale;
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
    if (dragData.value.isDragging && dragData.value.activeItem !== null) {
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

  onMounted(() => {
    const savedScale = localStorage.getItem(`${props.localStorageName}-scale`);
    const savedViewBox = localStorage.getItem(`${props.localStorageName}-viewBox`);
    if (savedViewBox) viewBox.value = JSON.parse(savedViewBox);
    if (savedScale && !isNaN(Number(savedScale)))
      scale.value = Math.min(maxScale.value, Math.max(minScale.value, Number(savedScale)));
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
  svg {
    display: block;
    height: 100%;
    width: 100%;
    touch-action: none;
    user-select: none;
    overflow: auto;
  }
</style>
