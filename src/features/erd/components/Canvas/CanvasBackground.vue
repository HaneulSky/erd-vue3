<template>
    <!-- Паттерн с трансформацией с точками для фона -->
      <pattern
        id="bg-pattern"
        patternUnits="userSpaceOnUse"
        :width="15 * props.scale"
        :height="15 * props.scale"
        :patternTransform="`translate(${props.viewBox.x % 15},${props.viewBox.y % 15})`"
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
</template>
<script setup lang="ts">
const props = defineProps<{
    scale: number,
    viewBox: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}>()
</script>