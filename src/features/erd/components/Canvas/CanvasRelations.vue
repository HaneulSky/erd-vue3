<template>
  <g class="connections">
    <path
      v-for="relation in relationPaths"
      :key="relation.id"
      :d="relation.path"
      stroke="#888A90"
      :stroke-width="1.5"
      fill="none"
      :marker-start="relation.markerStart"
      :marker-end="relation.markerEnd"
      @dblclick="$emit('edit:relation', relation.id)"
    />
  </g>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import type { Relation, Entity } from '@/features/erd/types/Table.model';

  const props = defineProps<{
    relations: Relation[];
    tables: Entity[];
    tableWidth: number;
  }>();

  defineEmits<{
    (e: 'edit:relation', value: string | number): void;
  }>();

  const relationsData = ref<Relation[]>([]);

  const relationPaths = computed(() =>
    relationsData.value.map((relation) => ({
      ...relation,
      path: getConnectionPath(relation),
      markerStart: getMarkerStart(relation),
      markerEnd: getMarkerEnd(relation),
    }))
  );

  const getTablesByRelations = (
    relation: Relation
  ): { sourceTable: Entity | null; targetTable: Entity | null } => {
    const sourceTable = props.tables.find((t) => t.id === relation.source?.id) || null;
    const targetTable = props.tables.find((t) => t.id === relation.target?.id) || null;

    return { sourceTable, targetTable };
  };

  const getMarkerStart = (relation: Relation): string => {
    const { sourceTable = null, targetTable = null } = getTablesByRelations(relation);
    if (!sourceTable || !targetTable) return '';
    const isSourceAbove = sourceTable.yAxis && targetTable.yAxis ? sourceTable.yAxis > targetTable.yAxis : false;
    const isVerticalStack = Math.abs((sourceTable.xAxis || 0) - (targetTable.xAxis || 0)) <= props.tableWidth;

    const relationType = relation.datatype?.name;
    let marker = 'url(#crossbar-one)';

    if (relationType === 'MtM') marker = 'url(#arrowhead-many-left)';
    if (relationType === 'MtO')
      marker =
        isSourceAbove && isVerticalStack ? 'url(#crossbar-one)' : 'url(#arrowhead-many-left)';
    if (relationType === 'OtM')
      marker =
        isSourceAbove && isVerticalStack ? 'url(#arrowhead-many-left)' : 'url(#crossbar-one)';

    return marker;
  };

  const getMarkerEnd = (relation: Relation): string => {
    const { sourceTable, targetTable } = getTablesByRelations(relation);
    if (!sourceTable || !targetTable) return '';
    const visualTableWidth = props.tableWidth;
    const sourceVisualCenter = (sourceTable.xAxis || 0) + visualTableWidth / 2;
    const targetVisualCenter = (targetTable.xAxis || 0) + visualTableWidth / 2;
    const isSourceLeft = sourceVisualCenter < targetVisualCenter;
    const isSourceAbove = (sourceTable.yAxis || 0) > (targetTable.yAxis || 0);
    const isVerticalStack = Math.abs((sourceTable.xAxis || 0) - (targetTable.xAxis || 0)) <= visualTableWidth;
    const relationType = relation.datatype?.name;
    let marker = 'url(#crossbar-one)';
    if (relationType === 'MtM')
      marker = isSourceLeft ? 'url(#arrowhead-many)' : 'url(#arrowhead-many-left)';
    if (relationType === 'MtO')
      marker =
        (isSourceAbove && !isVerticalStack) || !isSourceAbove
          ? 'url(#crossbar-one)'
          : 'url(#arrowhead-many-left)';
    if (relationType === 'OtM')
      marker =
        (isSourceAbove && !isVerticalStack) || !isSourceAbove
          ? 'url(#arrowhead-many-left)'
          : 'url(#crossbar-one)';

    return marker;
  };

  const getConnectionPoint = (
    table: Entity,
    side: string,
    relation: Relation,
    isSource: boolean
  ): { x: number; y: number } => {
    const visualHeaderHeight = 40;
    const fieldHeight = 40;
    const baseX = table.xAxis || 1;
    const baseY = table.yAxis || 1;
    let yPosition: number;
    const fieldName = isSource ? relation.sourceField?.name : relation.targetField?.name;
    const field = table.fields?.find((f) => f.name === fieldName);
    if (field) {
      const fieldIndex = table.fields?.findIndex((f) => f.name === fieldName) || 0;
      yPosition = baseY + visualHeaderHeight + fieldIndex * fieldHeight + fieldHeight / 2;
    } else {
      yPosition = baseY + visualHeaderHeight / 2;
    }
    const offset = 2;
    switch (side) {
      case 'left':
        return { x: baseX - offset, y: yPosition };
      case 'right':
        return { x: baseX + props.tableWidth + offset, y: yPosition };
      default:
        return { x: baseX + props.tableWidth / 2, y: yPosition };
    }
  };

  const getConnectionPath = (relation: Relation): string => {
    const { sourceTable, targetTable } = getTablesByRelations(relation);
    if (!sourceTable || !targetTable) return '';

    const isVerticalStack = Math.abs(sourceTable.xAxis! - targetTable.xAxis!) <= props.tableWidth;
    const isSourceAbove = sourceTable.yAxis! < targetTable.yAxis!;
    const sourceVisualCenterX = sourceTable.xAxis! + props.tableWidth / 2;
    const targetVisualCenterX = targetTable.xAxis! + props.tableWidth / 2;
    const isSourceLeft = sourceVisualCenterX < targetVisualCenterX;
    const baseRadius = 5;
    const markerSize = 15;
    const type = relation.datatype?.name;

    if (isVerticalStack) {
      const side = 'right';
      const offset = 40;
      const topTable = isSourceAbove ? sourceTable : targetTable;
      const bottomTable = isSourceAbove ? targetTable : sourceTable;
      const topPoint = getConnectionPoint(
        topTable,
        side,
        relation,
        topTable.id === relation.source?.id
      );
      const bottomPoint = getConnectionPoint(
        bottomTable,
        side,
        relation,
        bottomTable.id === relation.source?.id
      );
      const midX =
        Math.max(topTable.xAxis! + props.tableWidth, bottomTable.xAxis! + props.tableWidth) +
        offset;
      if (type === 'OtO' || (type === 'MtO' && !isSourceAbove) || (type === 'OtM' && isSourceAbove))
        topPoint.x += markerSize;
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

    if ((type === 'OtO' || type === 'OtM') && targetSide === 'left') start.x += markerSize;
    if ((type === 'OtO' || type === 'OtM') && targetSide === 'right') start.x -= markerSize;

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

  watch(
    () => props.relations,
    () => {
      relationsData.value = JSON.parse(JSON.stringify(props.relations));
    },
    { immediate: true, deep: true }
  );
</script>

<style scoped>
  .connections path {
    cursor: pointer;
    pointer-events: none;
    transition: d 0.3s ease-out;
    shape-rendering: crispEdges;
  }

  .connections path:hover {
    stroke: blue;
    box-shadow: 0 0 1px 1px #dadada;
  }

  @media (prefers-reduced-motion: reduce) {
    .connections path {
      transition: none;
    }
  }
</style>
