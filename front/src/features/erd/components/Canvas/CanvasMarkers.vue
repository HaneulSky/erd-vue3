<template>
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
</template>
<style scoped>
  pattern circle {
    shape-rendering: crispEdges;
  }
</style>
