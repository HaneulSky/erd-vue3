<template>
  <div>
    <Header />
    <ERDDiagramm
      :tables="tables"
      :relations="relations"
      :datatypes="datatypes"
      @create:table="addTable"
      @create:relation="addRelation"
      @update:relation="updateRelation"
      @delete:relation="deleteRelation"
      @update:table="updateTable"
      @delete:table="deleteTable"
      @create:field="createField"
      @update:field="updateField"
    />
     <CreateDiagramModal />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ERDDiagramm from '@/features/erd/components/ERDDiagramm.vue';
  import Header from '@/widgets/layout/Header.vue';
  import CreateDiagramModal from '@/features/diagram-management/ui/CreateDiagramModal.vue';

  interface Datatype {
    id: number;
    name: string;
  }

  interface Field {
    id: number;
    name: string;
    datatype?: Datatype;
    nullable: boolean;
    unique: boolean;
    increment: boolean;
    comment: string | null;
  }

  interface Table {
    id: number;
    name: string;
    comment: string;
    xAxis: number;
    yAxis: number;
    relations: unknown[];
    fields: Field[];
  }

  interface Relation {
    id: number;
    source?: Table;
    target?: Table;
    datatype?: Datatype;
    sourceField?: Field;
    targetField?: Field;
  }

  const tables = ref<Table[]>([
    {
      id: 1,
      name: 'User',
      comment: 'Это очень важная таблица, она нужна для существования таблицы ради таблицы',
      xAxis: 15,
      yAxis: 317,
      relations: [],
      fields: [
        {
          id: 1,
          name: 'id',
          datatype: { id: 5, name: 'int' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
        {
          id: 2,
          datatype: { id: 1, name: 'OtM' },
          name: 'roles',
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
      ],
    },
    {
      id: 2,
      name: 'Role',
      comment: 'Это очень важная таблица, она нужна для существования таблицы ради таблицы',
      xAxis: 11,
      yAxis: 128,
      relations: [],
      fields: [
        {
          id: 1,
          name: 'id',
          datatype: { id: 5, name: 'int' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
        {
          id: 2,
          name: 'users',
          datatype: { id: 2, name: 'MtO' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
      ],
    },
    {
      id: 3,
      name: 'Position',
      comment: 'Это очень важная таблица, она нужна для существования таблицы ради таблицы',
      xAxis: 482,
      yAxis: 139,
      relations: [],
      fields: [
        {
          id: 1,
          name: 'id',
          datatype: { id: 5, name: 'int' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
        {
          id: 2,
          name: 'department',
          datatype: { id: 2, name: 'OtM' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
      ],
    },
    {
      id: 4,
      name: 'Department',
      comment: 'Это очень важная таблица, она нужна для существования таблицы ради таблицы',
      xAxis: 488,
      yAxis: 343,
      relations: [],
      fields: [
        {
          id: 1,
          name: 'id',
          datatype: { id: 5, name: 'int' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
        {
          id: 2,
          name: 'position',
          datatype: { id: 2, name: 'MtO' },
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
      ],
    },
  ]);

  const relations = ref<Relation[]>([
    {
      id: 1,
      source: tables.value[0],
      target: tables.value[1],
      datatype: { id: 1, name: 'OtM' },
      sourceField: {
        id: 2,
        datatype: { id: 1, name: 'OtM' },
        name: 'roles',
        nullable: false,
        unique: true,
        increment: true,
        comment: null,
      },
      targetField: {
        id: 2,
        name: 'users',
        datatype: { id: 2, name: 'MtO' },
        nullable: false,
        unique: true,
        increment: true,
        comment: null,
      },
    },
    {
      id: 2,
      source: tables.value[2],
      target: tables.value[3],
      datatype: { id: 1, name: 'OtM' },
      sourceField: {
        id: 2,
        datatype: { id: 1, name: 'OtM' },
        name: 'department',
        nullable: false,
        unique: true,
        increment: true,
        comment: null,
      },
      targetField: {
        id: 2,
        name: 'position',
        datatype: { id: 2, name: 'MtO' },
        nullable: false,
        unique: true,
        increment: true,
        comment: null,
      },
    },
  ]);

  const datatypes = ref<Datatype[]>([
    { id: 1, name: 'OtM' },
    { id: 2, name: 'MtO' },
    { id: 3, name: 'OtO' },
    { id: 4, name: 'MtM' },
    { id: 5, name: 'int' },
    { id: 6, name: 'varchar' },
    { id: 7, name: 'float' },
  ]);

  const updateTable = (table: Table) => {
    const tableIndex = tables.value.findIndex((t) => t.id === table.id);
    tables.value[tableIndex] = { ...tables.value[tableIndex], ...table };
    console.log(tables.value);
  };

  const deleteRelation = ({ relation }: { relation: number }) => {
    const relationIndex = relations.value.findIndex((rel) => rel.id === relation);
    relations.value.splice(relationIndex, 1);
  };

  const deleteTable = ({ table }: { table: number }) => {
    const relationIndex = relations.value.findIndex(
      (rel) => rel.target?.id === table || rel.source?.id === table
    );
    if (relationIndex !== -1) relations.value.splice(relationIndex, 1);
    const tableIndex = tables.value.findIndex((t) => t.id === table);
    console.log('deleting', tableIndex);
    tables.value.splice(tableIndex, 1);
  };

  const getDatatypeByName = (name: string): Datatype | undefined => {
    return datatypes.value.find((dt) => dt.name === name);
  };

  const checkField = (name: string, fieldsArr: Field[]) => {
    return fieldsArr.find((fd) => fd.name === name);
  };

  const createField = ({
    table,
    name,
    datatype,
  }: {
    table: number;
    name: string;
    datatype: string;
  }) => {
    const tableIndex = tables.value.findIndex((t) => t.id === table);
    const fieldsArr = tables.value[tableIndex].fields;
    const hasField = checkField(name, fieldsArr);
    if (hasField) throw new Error('Такое поле в этой сущности уже существует');
    fieldsArr.push({
      id: (tables.value[tableIndex].fields?.length || 0) + 1,
      name: name || 'someField',
      datatype: getDatatypeByName(datatype),
      nullable: false,
      unique: false,
      increment: false,
      comment: null,
    });
    console.log('create field', tables.value);
  };

  const updateField = ({ table, id, name }: { table: number; id: number; name: string }) => {
    const tableIndex = tables.value.findIndex((t) => t.id === table);
    const field = tables.value[tableIndex].fields.find((f) => f.id === id);
    if (!field) throw new Error('не найдено поле');
    field.name = name;
  };

  const updateRelation = (data: Relation) => {
    console.log('updateRelation', data);
  };

  const addRelation = (data: Relation) => {
    relations.value.push({
      id: data.id,
      datatype: data.datatype,
    });
  };

  const addTable = () => {
    const lastTableCoords = {
      xAxis: 10,
      yAxis: 25,
    };
    if (tables.value.length) {
      const lastTable = tables.value.at(-1);
      lastTableCoords.xAxis = lastTable.xAxis + 100;
      lastTableCoords.yAxis = lastTable.yAxis + 100;
    }
    tables.value.push({
      id: (tables.value.length || 0) + 1,
      name: `New Table ${(tables.value.length || 0) + 1}`,
      comment: 'Это очень важная таблица, она нужна для существования таблицы ради таблицы',
      relations: [],
      fields: [
        {
          id: 1,
          name: 'id',
          nullable: false,
          unique: true,
          increment: true,
          comment: null,
        },
      ],
      ...lastTableCoords,
    });
  };
</script>
