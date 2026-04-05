<template>
  <!-- Паттерн с трансформацией с точками для фона -->
  <pattern
    id="bg-pattern"
    patternUnits="userSpaceOnUse"
    :width="getPatternSizes"
    :height="getPatternSizes"
    :patternTransform="getPatterTransform"
  >
    <circle
      cx="7.5"
      cy="7.5"
      r="1"
      fill="#dadada"
    />
  </pattern>

  <rect
    :x="getXRect"
    :y="getYRect"
    :width="getWidthRect"
    :height="getHeightRect"
    fill="url(#bg-pattern)"
    pointer-events="none"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
  const props = defineProps<{
    scale: number;
    viewBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>();

  const getPatternSizes = computed(() => 15 * props.scale) 
  const getPatterTransform = computed(() => {
    return `translate(${props.viewBox.x % 15},${props.viewBox.y % 15})`
  })

  const getXRect = computed(() => props.viewBox.x - 1000)
  const getYRect = computed(() => props.viewBox.y - 1000)
  const getWidthRect = computed(() => props.viewBox.width + 1000)
  const getHeightRect = computed(() => props.viewBox.height + 1000)
</script>
