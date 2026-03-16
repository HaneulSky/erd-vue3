<template>
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
</template>
<script setup lang="ts">
// TODO повторяшка
interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const props = defineProps<{
    scale: number,
    maxScale: number,
    minScale: number,
    localStorageName: string,
    viewBox: ViewBox,
    originalSizes: {
        width: number,
        height: number
    }
}>()

const emit = defineEmits<{
    (e: 'on-scale-button', value: {viewBox: ViewBox, scale: number}): void
}>();

const onScaleButton = (type: 'plus' | 'minus') => {
    const viewBoxLocal: ViewBox = props.viewBox
    let scale = 1;
  const delta = type === 'plus' ? 0.1 : -0.1;
  const newScale = Math.min(props.maxScale, Math.max(props.minScale, props.scale + delta));
  if (newScale !== props.scale) {
    const newWidth = props.originalSizes.width / newScale;
    const newHeight = props.originalSizes.height / newScale;
    viewBoxLocal.x += (viewBoxLocal.width - newWidth) / 2;
    viewBoxLocal.y += (viewBoxLocal.height - newHeight) / 2;
    viewBoxLocal.width = newWidth;
    viewBoxLocal.height = newHeight;
    scale = newScale;
    localStorage.setItem(`${props.localStorageName}-scale`, props.scale.toString());
    localStorage.setItem(`${props.localStorageName}-viewBox`, JSON.stringify(viewBoxLocal));

    emit('on-scale-button', {viewBox: viewBoxLocal, scale})
  }
};
</script>
<style scoped>
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
</style>