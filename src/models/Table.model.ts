export type RelationType = 'OtO' | 'OtM' | 'MtO' | 'MtM'

export interface Datatype {
  id: string | number;
  name: RelationType;
}

export interface Field {
    id: number
    name: string
    rusName?: string
    type: string
    relation: RelationType | null
    datatype?: Datatype;
}

export interface Entity {
    id: number
    name: string
    rusName?: string
    fields: Field[]
    xAxis?: number;
    yAxis?: number;
    comment?: string;
}

export interface Relation {
  id: string | number;
  source?: Entity;
  target?: Entity;
  datatype?: Datatype;
  sourceField?: Field;
  targetField?: Field;
  type?: string | null;
  from?: string | null;
  to?: string | null;
}
